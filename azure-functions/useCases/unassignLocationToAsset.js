import { unassignLocationAsset } from '../persistence/unassignAssetLocation.js';
import { getAssetByID } from '../persistence/getAssetByID.js';

export async function unassignLocationToAsset(assetId) {
  await getAssetByID(assetId);

  await unassignLocationAsset(assetId);
}
