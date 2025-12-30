import { getUserById } from './getUserById';
import { dataverseCall } from './dataverseCall';
import { NotFoundError } from '../errors/NotFoundError';

export async function assignAssetOwner(userId, assetId) {
  const rowId = await getUserById(userId);
  if (!rowId) {
    throw new NotFoundError(`User ${userId} not found`);
  }

  const body = {
    'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': `crf7f_ois_asset_entra_dat_users(${rowId})`,
    crf7f_asset_item_status: 0,
  };

  const query = `crf7f_ois_asset_rela_item_orgs(${assetId})`;
  return dataverseCall({
    query,
    method: 'PATCH',
    body,
  });
}
