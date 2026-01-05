import { app, HttpRequest, InvocationContext } from '@azure/functions';
import { ApiResponse, buildResponse } from './buildResponse.js';
import { assignLocationToAsset } from '../useCases/assignLocationToAsset.js';
import { unassignLocationToAsset } from '../useCases/unassignLocationToAsset.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';

// uses the built in azure interfaces and we can use the ApiResponse from buildResponse
// This ApiController doesn't return any used data hence we can simplify to ApiResponse<null> for T in buildResponse
export async function locationAssignmentsHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<ApiResponse<null>> {
  try {
    const assetId = request.params.assetid;
    const locationId = request.params.locationid;

    if (request.method === 'POST') {
      await assignLocationToAsset(assetId, locationId);
      return buildResponse(
        200,
        `Successfully assigned location for ${assetId}`,
        null,
      );
    } else if (request.method === 'DELETE') {
      await unassignLocationToAsset(assetId);
      return buildResponse(
        200,
        `Successfully unassigned location for ${assetId}`,
        null,
      );
    } else {
      throw new BadRequest('Invalid REST Method');
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      context.error('Bad request:', error.message);
      return buildResponse(400, error.message, null);
    }

    if (error instanceof NotFoundError) {
      context.error('Not Found:', error.message);
      return buildResponse(404, error.message, null);
    }

    if (error instanceof Error) {
      context.error('Error updating assignment:', error.message);
      return buildResponse(500, 'Unable to update assignments', null);
    }

    context.error('Unknown error:', error);
    return buildResponse(500, 'Unable to update assignments', null);
  }
}

app.http('locationassignments', {
  methods: ['POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/location/{locationid?}',
  handler: locationAssignmentsHandler,
});
