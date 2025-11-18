import { getUserById } from '../persistence/getUserById.js';
import { dataverseCall } from '../persistence/dataverseCall.js';
import { dataverseTokenHandler } from '../apiController/getDataverseTokenHandler.js';

export async function updateAssignment(request) {
  const { DATAVERSE_URL } = process.env;
  let assetId = request.params.assetid;

  let rowId;
  let body;
  let userId;

  if (request.method === 'POST') {
    userId = request.params.userid;

    rowId = await getUserById(userId);

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
    throw new Error('Invalid REST Method');
  }

  const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
  let token = await dataverseTokenHandler();
  await dataverseCall(token, url, 'PATCH', body);
}
