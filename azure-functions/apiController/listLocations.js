import { app } from '@azure/functions';
import { BadRequest } from '../errors/BadRequest.js';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { patchAppHttp } from '../useCases/maintenanceMode.js';
import { locationsWrapper } from '../useCases/locationsWrapper.js';

export async function listLocationsHandler(request, context) {
  try {
    if (request.method === 'GET') {
      const locations = await locationsWrapper();
      return buildResponse(200, 'Successfully retrieved locations', locations);
    } else {
      throw new BadRequest('Invalid REST Method');
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      return buildResponse(400, error.message);
    }
    if (error instanceof NotFoundError) {
      return buildResponse(404, error.message);
    }
    context.error(
      'Unable to list locations',
      error.response?.data || error.message,
    );

    return buildResponse(
      error.statusCode ?? 500,
      error.message ?? 'Internal Server Error',
    );
  }
}

patchAppHttp(app);

app.http('listLocations', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/locations',
  handler: listLocationsHandler,
});
