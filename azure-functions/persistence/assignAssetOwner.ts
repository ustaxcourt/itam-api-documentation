import { getUserById } from './getUserById.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';

// dataverseCall returns an object but we aren't currently modelling that
// Promise<unknown> is a placeholder until we better define that response - ZD 30 Dec 2025
export async function assignAssetOwner(
  userId: string,
  assetId: string,
): Promise<unknown> {
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
