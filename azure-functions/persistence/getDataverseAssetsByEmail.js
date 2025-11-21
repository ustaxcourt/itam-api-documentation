/* Commenting things out so ESLint doesn't yell at me any more...
import { dataverseCall } from "./dataverseCall";
import { returnLookupID } from "./returnLookupID";

export async function getDataverseAssetsByEmail(email) {
  try {
    //Things to fix: ODataQuery, both TABLE calls, returnLookupID
    const { DATAVERSE_URL } = process.env;
    const filter = {ODataQuery};
    const user = await returnLookupID(ENTRA-TABLE, email, GUID);
    const url = `${DATAVERSE_URL}/api/data/v9.2/${ASSET-TABLE}${filter}eq${user}`;

    const data = dataverseCall(url, "GET");
    const assets = data.value;
    return assets;

  } catch {
    //Maybe follow the pattern that Matt made to "bubble up" errors or throw a new "AppError"
    //Hoping to handle Auth error (401>), bad query (badrequest?), and network issues (500)
    throw new Error('Something went wrong lol')
  }

}
*/
