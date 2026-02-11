import { getUserById } from './getUserById.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function assignAssetOwner(userId, assetId) {
  const rowId = await getUserById(userId);
  if (!rowId) {
    throw new NotFoundError(`User ${userId} not found`);
  }

  const body = {
    'crf7f_userCurrentOwnerLookup@odata.bind': `crf7f_ois_asset_entra_dat_users(${rowId})`,
    crf7f_asset_item_status: 0,
  };

  const query = `crf7f_ois_assetses(${assetId})`;
  return dataverseCall({
    query,
    method: 'PATCH',
    body,
  });
}
