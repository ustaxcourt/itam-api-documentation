import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { dataverseCall } from './dataverseCall.js';

export async function unassignLocationAsset(assetId) {
  try {
    const body = {
      'crf7f_fac_asset_ref_location_lookup@odata.bind': null,
    };

    const url = `crf7f_ois_assetses(${assetId})`;
    return await dataverseCall({ query: url, method: 'PATCH', body: body });
  } catch (error) {
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError
    ) {
      console.error('Encountered error:', error.message);
      throw error;
    }

    throw new InternalServerError('Unable to unassign Location to Asset');
  }
}
