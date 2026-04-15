import { dataverseCall } from './dataverseCall.js';

export async function recommission(id) {
  const body = {
    crf7f_decommissioned: false, // Sets it to false.
  };

  const query = `crf7f_ois_assetses(${id})`;
  return dataverseCall({
    query,
    method: 'PATCH',
    body,
  });
}
