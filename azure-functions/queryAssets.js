import { app } from '@azure/functions';
import axios from 'axios';
import { getToken } from './oauth.js';

const { DATAVERSE_URL } = process.env;

app.http('queryAssets', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}',
  handler: async (request, context) => {
    try {
      const token = await getToken();
      if (!token) {
        return {
          status: 403,
          jsonBody: {
            error: 'Unauthorized',
            details: 'OAuth token is missing or invalid.'
          }
        };
      }

      const id = request.params.itemid;
      const name = request.query.get('name'); // string
      const condition = request.query.get('condition'); // integer (OptionSet)

      let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs`;

      if (id) {
        // Direct lookup by GUID
        url += `(${id})`;
      } else {
        const filters = [];
        //name functionality still in dev as syntax escapes # in the string URL encoding as of now. Condition search fully functional
        if (name) {
          filters.push(`crf7f_name eq '${name.replace(/'/g, "''")}'`);
        }

        if (condition && /^\d+$/.test(condition)) {
          filters.push(`crf7f_asset_item_condition eq ${condition}`);
        }

        if (filters.length > 0) {
          url += `?$filter=${filters.join(' and ')}`;
        }
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json'
        }
      });

      return {
        status: 200,
        jsonBody: response.data
      };
    } catch (error) {
      const status = error.response?.status || 500;
      context.error('Dataverse query error:', error.response?.data || error.message);

      return {
        status,
        jsonBody: {
          error: 'Dataverse query failed',
          details: error.response?.data?.error?.message || error.message
        }
      };
    }
  }
});
