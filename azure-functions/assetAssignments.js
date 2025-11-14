import { app } from '@azure/functions';
import { giveMeRowId } from './useCases/userHelpers.js';
import { tokenHandler } from './apiController/getTokenHandler.js';
import { dataverseCall } from './persistance/dataverseCall.js';
import { buildResponse } from './useCases/returnResponse.js';

const { DATAVERSE_URL } = process.env;

// ✅ Pulled-out named handler function
export async function assignmentsHandler(request, context) {
  try {
    let token = await tokenHandler();

    const assetId = request.params.assetid;
    let rowId;
    let body;

    if (request.method === 'POST') {
      const userId = request.params.userid;
      rowId = await giveMeRowId(userId);
      body = {
        'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': `crf7f_ois_asset_entra_dat_users(${rowId})`,
        crf7f_asset_item_status: 0,
      };
    } else if (request.method === 'DELETE') {
      body = {
        'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': null,
        crf7f_asset_item_status: 1,
      };
    } else {
      return {
        status: 404,
        jsonBody: 'Invalid REST Method',
      };
    }

    const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
    let response = await dataverseCall(token, url, 'PATCH', body);

    return await buildResponse(
      200,
      'Successfully to updated item assignment',
      response,
    );
  } catch (error) {
    const status =
      error.response?.status === 400 ? 404 : error.response?.status || 500;
    context.error(
      'Unable to update assignments',
      error.response?.data || error.message,
    );

    return {
      status,
      jsonBody: {
        error: 'Unable to update assignment',
        details:
          (status === 404
            ? 'invalid itemId or userId'
            : error.response?.data?.error?.message) || error.message,
      },
    };
  }
}

app.http('assignments', {
  methods: ['POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/assignments/{userid?}',
  handler: assignmentsHandler,
});
