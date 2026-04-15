import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequest } from '../errors/BadRequest.js';
import { patchAppHttp } from '../useCases/maintenanceMode.js';
import { assetSearchManager } from '../useCases/assetSearchManager.js';

export async function assetSearchHandler(request, context) {
  try {
    const queryObject = Object.fromEntries(request.query.entries());

    // This layer is orchestrating the search by forming the provided query object - validating its values, then running the filter operation and returning it as a list of assets from the filterDictByList function in the persistence layer
    const assets = await assetSearchManager(queryObject);

    return buildResponse(200, 'Success', assets);
  } catch (error) {
    if (error instanceof BadRequest) {
      return buildResponse(400, error.message);
    }
    if (error instanceof NotFoundError) {
      return buildResponse(404, error.message);
    }
    context.error(
      'Unable to complete search request.',
      error.response?.data || error.message,
    );

    return buildResponse(
      error.statusCode ?? 500,
      error.message ?? 'Internal Server Error',
    );
  }
}

patchAppHttp(app);

app.http('assetSearch', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/search',
  handler: assetSearchHandler,
});
