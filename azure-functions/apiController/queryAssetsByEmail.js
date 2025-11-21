import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { getAssetsByEmail } from '../useCases/getAssetsByEmail.js';
import { BadRequest } from '../errors/BadRequest.js';

export async function queryAssetsByEmail(request) {
  //Authenticated requests should contain the client principal header
  const validToken = request.headers['x-ms-client-principal'];
  if (!validToken) {
    throw new Error('Error 401: Unauthorized');
  }

  //Before doing any work, it's worth checking if there's even an email to use
  const email = request.query.email;
  if (!email) {
    throw new BadRequest('Missing query parameter: email');
  }

  const assets = await getAssetsByEmail(email);
  if (assets.length === 0) {
    throw new Error(`Error 404: No assets found for provided email: ${email}`);
  }

  return buildResponse(200, 'Success', assets);
}

app.http('queryAssetsByEmail', {
  methods: ['GET'],
  authLevel: 'anonymous',
  //route: whatever we decide for the endpoint
  handler: queryAssetsByEmail,
});
