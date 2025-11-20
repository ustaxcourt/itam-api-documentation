import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { getAssetsByEmail } from '../useCases/getAssetsByEmail.js';

export async function queryAssetsByEmail(request) {
  //Authenticated requests should contain the client principal header
  const validToken = request.headers['x-ms-client-principal'];
  if (!validToken) {
    return buildResponse(403, 'Unauthorized');
  }

  //Before doing any work, it's worth checking if there's even an email to use
  const email = request.query.email;
  if (!email) {
    return buildResponse(400, 'Missing query parameter: email');
  }

  const assets = await getAssetsByEmail(email);
  if (assets.length === 0) {
    return buildResponse(404, `No assets found for provided email: ${email}`);
  }

  return buildResponse(200, 'Success', assets);
}

app.http('queryAssetsByEmail', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: queryAssetsByEmail,
});
