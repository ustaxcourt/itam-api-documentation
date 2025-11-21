import { BadRequest } from '../errors/BadRequest.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { dataverseCall } from './dataverseCall.js';
import { filterDictionaryByList } from './filterDictbyList.js';

export async function getDataverseAssetsByEmail(email) {
  try {
    const { DATAVERSE_URL } = process.env;
    const url =
      `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs` +
      `?$filter=crf7f_ois_asset_entra_dat_userCurrentOw/crf7f_email eq '${email}'` +
      `&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_location)`;

    const data = await dataverseCall(url, 'GET');
    const assets = filterDictionaryByList(data['data']['value']);

    return assets;
  } catch (error) {
    if (error instanceof BadRequest || error instanceof DataverseTokenError) {
      throw error;
    }

    throw new Error(`Dataverse asset lookup failed: ${error.message}`);
  }
}
