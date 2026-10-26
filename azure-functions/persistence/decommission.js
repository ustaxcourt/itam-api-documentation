import { dataverseCall } from './dataverseCall.js';

export async function decommission(id) {
  const body = {
    crf7f_decommissioned: true, // Sets it to true.
  };

  const query = `crf7f_ois_assetses(${id})`;
  return dataverseCall({
    query,
    method: 'PATCH',
    body,
  });
}
