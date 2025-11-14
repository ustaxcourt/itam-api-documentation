import { app } from '@azure/functions';

import { filterDictionary } from './persistance/filterDict.js';

import { tokenHandler } from './apiController/getTokenHandler.js';
import { dataverseCall } from './persistance/dataverseCall.js';

import { buildResponse } from './useCases/returnResponse.js';

const { DATAVERSE_URL } = process.env;

app.http('queryAsset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}',
  handler: async (request, context) => {
    try {
      const id = request.params.itemid;
      let token = await tokenHandler();
      let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${id}'&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor, crf7f_entra_object_id,crf7f_phone, crf7f_location)`;
      let response = await dataverseCall(token, url, 'GET');
      const dictionary = filterDictionary(response.data['value'][0]);

      if (Object.keys(dictionary).length === 0) {
        return await buildResponse(404, 'Dataverse query failed');
        /*
        return {
          status: 404,
          jsonBody: {
            error: 'Dataverse query failed',
            details: 'Resource Not Found',
          },
        };
        */
      }

      return await buildResponse(200, 'Success', dictionary);
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
