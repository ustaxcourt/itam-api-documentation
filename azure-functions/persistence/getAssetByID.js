import { dataverseCall } from './dataverseCall.js';
import { filterDictionary } from './filterDict.js';

const { DATAVERSE_URL } = process.env;

export async function getAssetByID(id) {
  // Build Dataverse query URL
  const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${id}'&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_entra_object_id,crf7f_phone,crf7f_location)`;

  // API call
  const response = await dataverseCall(url, 'GET');

  // Normalize data
  return filterDictionary(response.data.value[0]);
}
