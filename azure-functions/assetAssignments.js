import { app } from '@azure/functions';
import axios from 'axios';
import { getToken } from './oauth.js';

const { DATAVERSE_URL } = process.env;


app.http('assignments', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/assignments/{userid}',
  handler: async (request, context) => {

    try {

      const token = await getToken();
      if (!token) {
        return {
          status: 403,
          jsonBody: {
            error: 'Unauthorized',
            details: 'Dataverse internal token is missing or invalid.'
          }
        }
      };

      const assetId = request.params.assetid;
      let userId;
      let body;

      if (request.method === 'POST') {
        let entrauserId = request.params.userid;
        let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_entra_dat_users?$filter=crf7f_name eq '${entrauserId}'`;
        let response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            Prefer: 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
          }
        });
        let rowId = response.data["value"][0]["crf7f_ois_asset_entra_dat_userid"];

        body = `crf7f_ois_asset_entra_dat_users(${rowId})`
      }
      else {
        body = null;
      }





      let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;

      let response = await axios.patch(url,
        {
          "crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind": body
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
            Prefer: 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
            'If-Match': '*'
          }
        });


      return {
        status: 200,
        jsonBody: "Successfully to updated item assignment"
      };
    } catch (error) {
      const status = error.response?.status === 400 ? 404 : error.response?.status || 500;
      context.error('Unable to update assignments', error.response?.data || error.message);

      return {
        status,
        jsonBody: {
          error: 'Unable to update assignment',
          details: (status === 404 ? 'invalid itemId or userId' : error.response?.data?.error?.message) || error.message
        }
      };
    }
  }
});




