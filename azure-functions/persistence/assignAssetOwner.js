import { getUserById } from './getUserById.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function assignAssetOwner(userId, assetId) {
  const { DATAVERSE_URL } = process.env;

  const rowId = await getUserById(userId);
  if (!rowId) {
    throw new NotFoundError(`User ${userId} not found`);
  }

  const body = {
    'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': `crf7f_ois_asset_entra_dat_users(${rowId})`,
    crf7f_asset_item_status: 0,
  };

  const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
  return dataverseCall(url, 'PATCH', body);
}
