import { assignLocationAsset } from '../persistence/assignAssetLocation.js';
import { getLocationById } from '../persistence/getLocationById.js';
import { getAssetByID } from '../persistence/getAssetByID.js';

//This function isn't returning any value so we can return a voided promise
export async function assignLocationToAsset(
  assetId: string,
  locationId: string,
): Promise<void> {
  await getLocationById(locationId);

  await getAssetByID(assetId);

  await assignLocationAsset(assetId, locationId);
}
