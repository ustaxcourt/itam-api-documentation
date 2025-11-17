import { getToken } from '../oauth.js';
import { dataverseCall } from './dataverseCall.js';

const { DATAVERSE_URL } = process.env;

export async function getUserById(userid) {
  try {
    const token = await getToken();
    let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_entra_dat_users?$filter=crf7f_name eq '${userid}'`;
    let response = await dataverseCall(token, url, 'GET');
    let rowId = response.data['value'][0]['crf7f_ois_asset_entra_dat_userid'];
    return rowId;
  } catch {
    return null;
  }
}
