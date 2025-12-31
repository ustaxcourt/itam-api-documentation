import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { dataverseCall } from './dataverseCall.js';

//Promise may need to be changed to void instead of unknown if we're not using the return
export async function assignLocationAsset(
  assetId: string,
  locationId: string,
): Promise<unknown> {
  try {
    const body = {
      'crf7f_fac_asset_ref_locationLookup@odata.bind': `crf7f_fac_asset_ref_locations(${locationId})`,
    };

    const url = `crf7f_ois_asset_rela_item_orgs(${assetId})`;
    return await dataverseCall({ query: url, method: 'PATCH', body: body });
  } catch (error) {
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError
    ) {
      console.error('Encountered error:', error.message);
      throw error;
    }

    throw new InternalServerError('Unable to assign Location to Asset');
  }
}
