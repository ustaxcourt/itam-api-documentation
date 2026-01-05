import { getDataverseAssetsByEmail } from '../persistence/getDataverseAssetsByEmail.js';

//Bubbling up the array structure from the persistence method
export async function getAssetsByEmail(
  email: string,
): Promise<Record<string, unknown>[]> {
  return await getDataverseAssetsByEmail(email);

  //Possible Tech Debt:
  //If we ever need to distinguish between no assets for a valid email vs an invalid email
  //We could add another Dataverse lookup against the user/aad/entra table here
}
