import { AppError } from '../errors/error.js';
import { assignLocationAsset } from '../persistence/assignAssetLocation.js';
import { getId } from '../useCases/returnLookupID.js';

export async function assignLocationToAsset(assetId, locationName) {
  try {
    let locationId = await getId(
      'crf7f_fac_asset_ref_locations',
      'crf7f_name',
      locationName,
    );
    await assignLocationAsset(assetId, locationId);
  } catch (error) {
    if (error.passUp) {
      throw error;
    } else {
      throw new AppError(404, 'Asset ID not found', true);
    }
  }
}
