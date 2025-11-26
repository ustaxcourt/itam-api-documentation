import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
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
    throw new NotFoundError('Location ID not found');
  }

  try {
    await assignLocationAsset(assetId, locationId);
  } catch (error) {
    if (error instanceof InternalServerError) {
      throw error;
    } else {
      throw new NotFoundError('Asset ID not found');
    }
  }
}
