import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';

export async function getUserById(userid) {
  const query = `crf7f_ois_asset_entra_dat_users?$filter=crf7f_name eq '${userid}'`;
  const response = await dataverseCall({ query, method: 'GET' });

  if (!response?.value) {
    throw new InternalServerError('Dataverse call failed');
  } else if (response.value.length === 0) {
    throw new NotFoundError(`No user found for ID: ${userid}`);
  }

  return response.value[0].crf7f_ois_asset_entra_dat_userid;
}
