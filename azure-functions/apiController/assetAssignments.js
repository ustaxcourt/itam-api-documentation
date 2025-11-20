import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { assignAssetToUser } from '../useCases/assignAssetToUser.js';
import { unassignAsset } from '../useCases/unassignAsset.js';
import { BadRequest } from '../errors/BadRequest.js';

export async function assignmentsHandler(request, context) {
  try {
    const assetId = request.params.assetid;

    if (request.method === 'POST') {
      const userId = request.params.userid;
      await assignAssetToUser(userId, assetId);
    } else if (request.method === 'DELETE') {
      await unassignAsset(assetId);
    } else {
      throw new BadRequest('Invalid REST Method');
    }

    return buildResponse(200, 'Successfully updated item assignment', assetId);
  } catch (error) {
    context.error(
      'Unable to update assignments',
      error.response?.data || error.message,
    );

    if (error instanceof BadRequest) {
      return buildResponse(error.statusCode, error.message);
    }

    if (error.response?.status === 400 || error.response?.status === 204) {
      return buildResponse(
        404,
        'Unable to update assignment due to invalid assetid or userid',
      );
    } else if (error.response?.status === 401) {
      return buildResponse(403, 'Unauthorized');
    } else {
      return buildResponse(
        error.response?.status || 500,
        'Unable to update assignment',
      );
    }
  }
}

app.http('assignments', {
  methods: ['POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/assignments/{userid?}',
  handler: assignmentsHandler,
});
