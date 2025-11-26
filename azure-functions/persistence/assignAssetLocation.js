import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { dataverseCall } from './dataverseCall.js';

export async function assignLocationAsset(assetId, locationId) {
  try {
    const body = {
      'crf7f_fac_asset_ref_locationLookup@odata.bind': `crf7f_fac_asset_ref_locations(${locationId})`,
    };

    const url = `crf7f_ois_asset_rela_item_orgs(${assetId})`;
    return dataverseCall({ query: url, method: 'PATCH', body: body });
  } catch (error) {
    if (error instanceof InternalServerError) {
      throw error;
    } else {
      throw new NotFoundError('Asset ID not found');
    }
  }
}
