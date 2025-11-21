import { BadRequest } from '../errors/BadRequest';
import { DataverseTokenError } from '../errors/DataverseTokenError';
import { dataverseCall } from './dataverseCall';
import { filterDictionary } from './filterDict';

export async function getDataverseAssetsByEmail(email) {
  try {
    const { DATAVERSE_URL } = process.env;
    const url =
      `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs` +
      `?$filter=crf7f_ois_asset_entra_dat_userCurrentOw/crf7f_email eq '${email}'` +
      `&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_location)`;

    const data = await dataverseCall(url, 'GET');
    const assets = filterDictionary(data);
    return assets;
  } catch (error) {
    if (error instanceof BadRequest || error instanceof DataverseTokenError) {
      throw error;
    }

    throw new Error(`Dataverse asset lookup failed: ${error.message}`);
  }
}
