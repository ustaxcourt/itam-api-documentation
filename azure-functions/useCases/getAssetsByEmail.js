import { getDataverseAssetsByEmail } from '../persistence/getDataverseAssetsByEmail';

//asset arrays of zero length are handled at the controller level
export async function getAssetsByEmail(email) {
  return await getDataverseAssetsByEmail(email);

  //Possible Tech Debt:
  //If we ever need to distinguish between no assets for a valid email vs an invalid email
  //We could add another Dataverse lookup against the user/aad/entra table here
}
