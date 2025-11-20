import { dataverseCall } from './dataverseCall.js';

export async function getUserById(userid) {
  const { DATAVERSE_URL } = process.env;

  try {
    const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_entra_dat_users?$filter=crf7f_name eq '${userid}'`;
    const response = await dataverseCall(url, 'GET');

    if (!response?.value || response.value.length === 0) {
      return null;
    }

    return response.value[0].crf7f_ois_asset_entra_dat_userid;
  } catch (error) {
    console.error('Error in getUserById:', error.message);
    return null;
  }
}
