import { app } from '@azure/functions';
import { getUserById } from './persistance/getUserById.js';
import { tokenHandler } from './apiController/getTokenHandler.js';
import { dataverseCall } from './persistance/dataverseCall.js';
import { buildResponse } from './apiController/returnResponse.js';

const { DATAVERSE_URL } = process.env;

// ✅ Pulled-out named handler function
export async function assignmentsHandler(request, context) {
  try {
    let token = await tokenHandler();
    const assetId = request.params.assetid;
    console.log(assetId);

    let rowId;
    let body;

    if (request.method === 'POST') {
      const userId = request.params.userid;
      rowId = await getUserById(userId);
      console.log(rowId);

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
      return buildResponse(404, 'Invalid REST Method');
    }

    const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;

    await dataverseCall(token, url, 'PATCH', body);

    return await buildResponse(
      200,
      'Successfully updated item assignment',
      assetId,
    );
  } catch (error) {
    context.error(
      'Unable to update assignments',
      error.response?.data || error.message,
    );
    //wrong userid or asset and we return a 404
    if (error.response?.status == 400) {
      return await buildResponse(
        404,
        'Unable to update assignment due to inavlid assetid or userid',
      );
    } else if (error.response?.status == 401) {
      return await buildResponse(403, 'Unauthorized');
    }

    if (error.response?.status == 204) {
      return await buildResponse(
        404,
        'Unable to update assignment due to inavlid assetid or userid boop',
      );
    } else {
      return await buildResponse(
        error.response?.status,
        'Unable to update assignment',
      );
    }
  }
}

app.http('assignments', {
  methods: ['POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/assignments/{userid?}',
  handler: assignmentsHandler,
});
