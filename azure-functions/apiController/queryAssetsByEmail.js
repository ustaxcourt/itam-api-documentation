import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { getAssetsByEmail } from '../useCases/getAssetsByEmail.js';
import { BadRequest } from '../errors/BadRequest.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

export async function queryAssetsByEmail(request) {
  //Authenticated requests should contain the client principal header
  //Bypass this to test properly as anon strips header sent in
  const validToken = request.headers['x-ms-client-principal'];
  if (!validToken) {
    throw new DataverseTokenError('Unauthorized');
  }

  //Before doing any work, it's worth checking if there's even an email to use
  const email = request.query.email;
  if (!email) {
    throw new BadRequest('Missing query parameter: email');
  }

  const assets = await getAssetsByEmail(email);
  if (assets.length === 0) {
    throw new BadRequest(`No assets found for provided email: ${email}`);
  }

  return buildResponse(200, 'Success', assets);
}

app.http('queryAssetsByEmail', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'api/v1/assets/userAssets/{email}',
  handler: queryAssetsByEmail,
});
