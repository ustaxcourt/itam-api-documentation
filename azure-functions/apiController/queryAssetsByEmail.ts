import { app, HttpRequest } from '@azure/functions';
import { ApiResponse, buildResponse } from './buildResponse.js';
import { getAssetsByEmail } from '../useCases/getAssetsByEmail.js';

//Can leverage azure's built-in interface and the ApiResponse we made in BuildResponse
export async function queryAssetsByEmail(
  request: HttpRequest,
): Promise<ApiResponse<Record<string, unknown>[]>> {
  try {
    const email = request.params.email;
    const assets = await getAssetsByEmail(email);

    return buildResponse(200, 'Success', assets);
  } catch (error) {
    if (error instanceof Error) {
      // This is to catch edge cases where it throws something other than an error
      console.error(`Encountered error: ${error.message}`);
      return buildResponse(
        500,
        error.message,
        null, //instead of returning the error.message we're explicitly using null to keep the return type narrow
      );
    }
    console.error('Unknown error:', error); // Catch case for those weird edge cases
    return buildResponse(500, 'Unknown error', null);
  }
}
app.http('queryAssetsByEmail', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/users/email/{email}/assets',
  handler: queryAssetsByEmail,
});
