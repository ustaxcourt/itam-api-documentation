import { app } from '@azure/functions';
import axios from 'axios';
import { getToken } from '../src/persistence/dataverse/getToken.js';
import { filterDictionary } from './helperFunctions/filterDict.js';

const { DATAVERSE_URL } = process.env;

app.http('queryAsset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}',
  handler: async (request, context) => {
    try {
      const id = request.params.itemid;
      const token = await getToken();
      if (!token) {
        return {
          status: 403,
          jsonBody: {
            error: 'Unauthorized',
            details: 'Dataverse internal token is missing or invalid.',
          },
        };
      }

      let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${id}'&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor, crf7f_entra_object_id,crf7f_phone, crf7f_location)`;

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          Prefer:
            'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
        },
      });

      const dictionary = filterDictionary(response.data['value'][0]);

      if (Object.keys(dictionary).length === 0) {
        return {
          status: 404,
          jsonBody: {
            error: 'Dataverse query failed',
            details: 'Resource Not Found',
          },
        };
      }

      return {
        status: 200,
        jsonBody: dictionary,
      };
    } catch (error) {
      const status = error.response?.status || 500;
      context.error(
        'Dataverse query error:',
        error.response?.data || error.message,
      );

      return {
        status,
        jsonBody: {
          error: 'Dataverse query failed',
          details: error.response?.data?.error?.message || error.message,
        },
      };
    }
  },
});
