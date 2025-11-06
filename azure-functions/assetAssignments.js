import { app } from '@azure/functions';
import axios from 'axios';
import { getToken } from './oauth.js';

import { giveMeRowId } from './helperFunctions/userHelpers.js';

const { DATAVERSE_URL } = process.env;


app.http('assignments', {
  methods: ['POST', 'DELETE'],
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
      var rowId;

      if (request.method === 'POST') {
        let userId = request.params.userid;
        rowId = giveMeRowId(userId)
        var body = {
          "crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind": `crf7f_ois_asset_entra_dat_users(${rowId})`,
          "crf7f_asset_item_status": 0
        };
      }
      else {
        var body = {
          "crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind": null,
          "crf7f_asset_item_status": 1

        };
      }

      let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
      let response = await axios.patch(url,
        body,
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




