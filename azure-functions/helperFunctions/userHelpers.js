import axios from 'axios';
import { getToken } from '../oauth.js';

const { DATAVERSE_URL } = process.env;

export async function giveMeRowId(userid) {
  const token = await getToken();

  let url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_entra_dat_users?$filter=crf7f_name eq '${userid}'`;
  let response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      Prefer: 'odata.include-annotations="OData.Community.Display.V1.FormattedValue"'
    }
  });
  let rowId = response.data["value"][0]["crf7f_ois_asset_entra_dat_userid"];
  return rowId
}
