import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { getAssetsByEmail } from '../useCases/getAssetsByEmail.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function queryAssetsByEmail(request) {
  try {
    const email = request.params.email;
    const assets = await getAssetsByEmail(email);

    if (assets.length === 0) {
      throw new NotFoundError(`No assets found for provided email: ${email}`);
    }

    return buildResponse(200, 'Success', assets);
  } catch (error) {
    console.log(`Encounted error: ${error.message}`);
    return buildResponse(error.statusCode, error.message);
  }
}
app.http('queryAssetsByEmail', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/userAssets/{email}',
  handler: queryAssetsByEmail,
});
