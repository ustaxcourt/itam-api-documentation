import { app } from '@azure/functions';
import { buildResponse } from './buildResponse';
import { assignLocationToAsset } from '../useCases/assignLocationToAsset';
import { unassignLocationToAsset } from '../useCases/unassignLocationToAsset';
import { BadRequest } from '../errors/BadRequest';

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
