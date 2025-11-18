import { getUserById } from './getUserById.js';
import { dataverseCall } from './dataverseCall.js';

export async function assignAssetOwner(userId, assetId) {
  const { DATAVERSE_URL } = process.env;

  const rowId = await getUserById(userId);

  const body = {
    'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': `crf7f_ois_asset_entra_dat_users(${rowId})`,
    crf7f_asset_item_status: 0,
  };

  const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
  return dataverseCall(url, 'PATCH', body);
}
