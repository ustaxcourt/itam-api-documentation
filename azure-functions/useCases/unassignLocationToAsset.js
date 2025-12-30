import { unassignLocationAsset } from '../persistence/unassignAssetLocation';
import { getAssetByID } from '../persistence/getAssetByID';

export async function unassignLocationToAsset(assetId) {
  await getAssetByID(assetId);

  await unassignLocationAsset(assetId);
}
