import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { dataverseCall } from './dataverseCall.js';
import { filterDictionaryByList } from './filterDictbyList.js';

export async function getDataverseAssetsByEmail(email) {
  try {
    const url =
      'crf7f_ois_assetses' +
      `?$filter=crf7f_userCurrentOwnerLookup/crf7f_email eq '${email}'` +
      `&$expand=crf7f_userCurrentOwnerLookup($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_location),crf7f_ois_asset_ref_model_lookup($select=crf7f_warrantyinformation)`;

    const data = await dataverseCall({ query: url, method: 'GET' });
    const assets = filterDictionaryByList(data.value);

    return assets;
  } catch (error) {
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError
    ) {
      throw error;
    }

    throw new InternalServerError(
      `Dataverse asset lookup failed: ${error.message}`,
    );
  }
}
