import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequest } from '../errors/BadRequest.js';
import { patchAppHttp } from '../useCases/maintenanceMode.js';
import { assetSearchManager } from '../useCases/assetSearchManager.js';
import { buildSearchCriteria } from '../useCases/buildSearchCriteria.js';

export async function assetSearchHandler(request, context) {
  try {
    context.log('Raw query params:', request.query);

    const queryObject = Object.fromEntries(request.query.entries());

    context.log('Normalized query:', queryObject);

    const criteria = buildSearchCriteria(queryObject);

    context.log(
      'Criteria after buildSearchCriteria:',
      JSON.stringify(criteria, null, 2),
    );

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
