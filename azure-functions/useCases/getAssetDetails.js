import { tokenHandler } from '../apiController/getTokenHandler.js';
import { dataverseCall } from '../persistance/dataverseCall.js';
import { filterDictionary } from '../persistance/filterDict.js';

const { DATAVERSE_URL } = process.env;

export async function getAssetDetails(id) {
  const token = await tokenHandler();

  // Build Dataverse query URL (business logic)
  const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${id}'&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_entra_object_id,crf7f_phone,crf7f_location)`;

  // Call persistence layer
  const response = await dataverseCall(token, url, 'GET');

  // Apply business logic (filtering)
  return filterDictionary(response.data.value[0]);
}
