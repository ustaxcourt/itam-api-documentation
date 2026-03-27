import { dataverseCall } from './dataverseCall.js';

export async function checkDecommissioned(id) {
  const query = `crf7f_ois_assetses(${id})?$select=crf7f_decommissioned`;

  const response = await dataverseCall({
    query,
    method: 'GET',
  });
  // Returns true if decommissioned is true
  return response.crf7f_decommissioned === true;
}
