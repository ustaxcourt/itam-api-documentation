import { getAssetById } from '../persistence/getAssetById.js';

export async function getAssetDetails(id) {
  // From persistence layer
  const asset = await getAssetById(id);

  return asset;
}
