import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { dataverseCall } from './dataverseCall.js';
import { filterDictionaryByList } from './filterDictbyList.js';

type DataverseResponse<T> = {
  value?: T[];
};

export async function getDataverseAssetsByEmail(
  email: string,
): Promise<Record<string, unknown>[]> {
  try {
    const url =
      'crf7f_ois_asset_rela_item_orgs' +
      `?$filter=crf7f_ois_asset_entra_dat_userCurrentOw/crf7f_email eq '${email}'` +
      `&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_location)`;

    // We get the DataverseResponse shape from the underlying Filter functions and what to expect out
    // In this case a record with string keys, and an unknown value
    const data = (await dataverseCall({
      query: url,
      method: 'GET',
    })) as DataverseResponse<Record<string, unknown>>;
    const assets = filterDictionaryByList<Record<string, unknown>>(data.value);

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
