import { getAssetById } from '../persistence/getAssetByID.js';

export async function getAssetDetails(id) {
  // From persistence layer
  const asset = await getAssetById(id);

  return asset;
}
