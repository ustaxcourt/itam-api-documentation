import { getAssetByID } from '../persistence/getAssetByID.js';
import { checkDecommissioned } from '../persistence/checkDecommissioned.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function getAssetDetails(id) {
  // First let us check if the asset is decommissioned
  const decommissioned = await checkDecommissioned(id);

  if (decommissioned) {
    throw new NotFoundError('This asset has been decommissioned.');
  }
  // From persistence layer
  const asset = await getAssetByID(id);

  return asset;
}
