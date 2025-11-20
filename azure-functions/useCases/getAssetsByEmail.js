import { getDataverseAssetsByEmail } from '../persistence/getDataverseAssetsByEmail.js';

//asset arrays of zero length are handled at the controller level
export async function getAssetsByEmail(email) {
  return await getDataverseAssetsByEmail(email);
}
