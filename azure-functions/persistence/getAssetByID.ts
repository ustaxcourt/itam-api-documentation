import { dataverseCall } from './dataverseCall.js';
import { filterDictionary } from './filterDict.js';
import { NotFoundError } from '../errors/NotFoundError.js';

//Even though this function returns a single asset, Dataverse responds with an array
type DataverseResponse<T> = {
  value?: T[];
};

export async function getAssetByID(
  id: string,
): Promise<Record<string, unknown>> {
  // Build Dataverse query URL
  const query = `crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${id}'&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_entra_object_id,crf7f_phone,crf7f_location)`;

  // Dataverse call

  const response = (await dataverseCall({
    query: query,
    method: 'GET',
  })) as DataverseResponse<Record<string, unknown>>;
  if (!response?.value || response.value.length === 0) {
    throw new NotFoundError(`No asset found for ID: ${id}`);
  }

  // Normalize data
  return filterDictionary(response.value[0]);
}
