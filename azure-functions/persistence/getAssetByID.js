import { dataverseCall } from './dataverseCall.js';
import { filterDictionary } from './filterDict.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function getAssetByID(id) {
  // Build Dataverse query URL
  const query = `crf7f_ois_assetses?$filter=crf7f_ois_assetsid eq '${id}'&$expand=crf7f_userCurrentOwnerLookup($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_entra_object_id,crf7f_phone,crf7f_location),crf7f_ois_asset_ref_model_lookup($select=crf7f_warrantyinformation)`;

  // Dataverse call
  const response = await dataverseCall({ query: query, method: 'GET' });
  if (!response?.value || response.value.length === 0) {
    throw new NotFoundError(`No asset found for ID: ${id}`);
  }
  // Normalize data
  return filterDictionary(response.value[0]);
}
