import { BadRequest } from '../errors/BadRequest.js';
import { dataverseCall } from './dataverseCall.js';

export async function assignLocationAsset(assetId, locationId) {
  try {
    const { DATAVERSE_URL } = process.env;
    const body = {
      'crf7f_fac_asset_ref_locationLookup@odata.bind': `crf7f_fac_asset_ref_locations(${locationId})`,
    };

    const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
    return dataverseCall(url, 'PATCH', body);
  } catch {
    throw new BadRequest('Invalid Asset ID');
  }
}
