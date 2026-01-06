import { assignLocationAsset } from '../persistence/assignAssetLocation';
import { getLocationById } from '../persistence/getLocationById';
import { getAssetByID } from '../persistence/getAssetByID';

export async function assignLocationToAsset(assetId, locationId) {
  await getLocationById(locationId);

  await getAssetByID(assetId);

  await assignLocationAsset(assetId, locationId);
}
