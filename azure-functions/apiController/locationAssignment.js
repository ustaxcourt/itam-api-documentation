import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { assignLocationToAsset } from '../useCases/assignLocationToAsset.js';
import { unassignLocationToAsset } from '../useCases/unassignLocationToAsset.js';
import { BadRequest } from '../errors/BadRequest.js';

export async function locationAssignmentsHandler(request, context) {
  try {
    const assetId = request.params.assetid;
    const locationId = request.params.locationid;

    if (request.method === 'POST') {
      await assignLocationToAsset(assetId, locationId);
      return buildResponse(200, 'Successfully assigned location', assetId);
    } else if (request.method === 'DELETE') {
      await unassignLocationToAsset(assetId);
      return buildResponse(200, 'Successfully unassigned location', assetId);
    } else {
      throw new BadRequest('Invalid REST Method');
    }
  } catch (error) {
    context.error(
      'Unable to update assignments',
      error.response?.data || error.message,
    );
    return buildResponse(error.statusCode, error.message);
  }
}

app.http('locationassignments', {
  methods: ['POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/location/{locationid?}',
  handler: locationAssignmentsHandler,
});
