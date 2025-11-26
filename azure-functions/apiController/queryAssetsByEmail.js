import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { getAssetsByEmail } from '../useCases/getAssetsByEmail.js';

export async function queryAssetsByEmail(request) {
  try {
    const email = request.params.email;
    const assets = await getAssetsByEmail(email);

    return buildResponse(200, 'Success', assets);
  } catch (error) {
    console.log(`Encounted error: ${error.message}`);
    return buildResponse(error.statusCode, error.message);
  }
}
app.http('queryAssetsByEmail', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/users/email/{email}/assets',
  handler: queryAssetsByEmail,
});
