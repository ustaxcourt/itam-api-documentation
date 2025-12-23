import { getAssetByID } from '../persistence/getAssetByID';

export async function getAssetDetails(id) {
  // From persistence layer
  const asset = await getAssetByID(id);

  return asset;
}
