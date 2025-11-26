import { BadRequest } from '../errors/BadRequest.js';
import { assignLocationAsset } from '../persistence/assignAssetLocation.js';
import { getId } from '../useCases/returnLookupID.js';

export async function assignLocationToAsset(assetId, locationid) {
  let locationId;
  try {
    locationId = await getId(
      'crf7f_fac_asset_ref_locations',
      'crf7f_fac_asset_ref_locationid',
      locationid,
    );
  } catch {
    throw new BadRequest('Location ID not found');
  }

  try {
    await assignLocationAsset(assetId, locationId);
  } catch {
    throw new BadRequest('Asset ID not found');
  }
}
