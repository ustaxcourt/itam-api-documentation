import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequest } from '../errors/BadRequest.js';
import { patchAppHttp } from '../useCases/maintenanceMode.js';
import { assetSearchManager } from '../useCases/assetSearchManager.js';
import { validateSearchCriteria } from '../useCases/validateSearchCriteria.js';

export async function assetSearchHandler(request, context) {
  try {
    const queryObject = Object.fromEntries(request.query.entries());

    // This use case is checking to see if the query parameters are valid (parameters and syntax wise) and then transforming them into a criteria object that the assetSearchManager can use to query the database
    const criteria = validateSearchCriteria(queryObject);

    // This layer is orchestrating the search by taking the formed criteria - passing it to validate values, then running the filter operation and returning it as a list of assets from the filterDictByList function in the persistence layer
    const assets = await assetSearchManager(criteria);

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
