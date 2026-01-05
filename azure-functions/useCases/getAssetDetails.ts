import { getAssetByID } from '../persistence/getAssetByID.js';

//Bubbling up the Record structure from persistence method
//Defining an Asset type may be valuable
export async function getAssetDetails(
  id: string,
): Promise<Record<string, unknown>> {
  // From persistence layer
  const asset = await getAssetByID(id);

  return asset;
}
