import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { assignLocationToAsset } from '../useCases/assignLocationToAsset.js';
import { BadRequest } from '../errors/BadRequest.js';

export async function locationAssignmentsHandler(request, context) {
  try {
    const assetId = request.params.assetid;
    const locationId = request.params.locationid;

    if (request.method === 'POST') {
      await assignLocationToAsset(assetId, locationId);
    } else {
      throw new BadRequest('Invalid REST Method');
    }

    return buildResponse(200, 'Successfully assigned location', assetId);
  } catch (error) {
    context.error(
      'Unable to update assignments',
      error.response?.data || error.message,
    );
    return buildResponse(error.statusCode, error.message);
  }
}

app.http('locationassignments', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/location/{locationid}',
  handler: locationAssignmentsHandler,
});
