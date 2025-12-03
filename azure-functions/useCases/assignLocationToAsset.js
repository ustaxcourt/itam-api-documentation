import { assignLocationAsset } from '../persistence/assignAssetLocation.js';
import { getLocationById } from '../persistence/getLocationById.js';
import { getAssetByID } from '../persistence/getAssetByID.js';

export async function assignLocationToAsset(assetId, locationId) {
  await getLocationById(locationId);

  await getAssetByID(assetId);

  await assignLocationAsset(assetId, locationId);
}
