import { DataverseTokenError } from '../errors/DataverseTokenError';
import { InternalServerError } from '../errors/InternalServerError';
import { dataverseCall } from './dataverseCall';
import { filterDictionaryByList } from './filterDictbyList';

export async function getDataverseAssetsByEmail(email) {
  try {
    const url =
      'crf7f_ois_asset_rela_item_orgs' +
      `?$filter=crf7f_ois_asset_entra_dat_userCurrentOw/crf7f_email eq '${email}'` +
      `&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_location)`;

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
