import { dataverseCall } from './dataverseCall';
import { filterDictionary } from './filterDict';

export async function getDataverseAssetsByEmail(email) {
  try {
    const { DATAVERSE_URL } = process.env;
    const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_entra_dat_userCurrentOw/crf7f_email eq ${email}&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor, crf7f_location)`;
    const data = dataverseCall(url, 'GET');
    const assets = filterDictionary(data);
    return assets;
  } catch {
    //Maybe follow the pattern that Matt made to "bubble up" errors or throw a new "AppError"
    //Hoping to handle Auth error (401?), bad query (badrequest?), and network issues (500)
    throw new Error('Something went wrong lol');
  }
}
