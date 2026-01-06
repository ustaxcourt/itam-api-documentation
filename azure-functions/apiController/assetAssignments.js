import { app } from '@azure/functions';
import { buildResponse } from './buildResponse';
import { assignAssetToUser } from '../useCases/assignAssetToUser';
import { unassignAsset } from '../useCases/unassignAsset';
import { BadRequest } from '../errors/BadRequest';
import { NotFoundError } from '../errors/NotFoundError';

export async function assignmentsHandler(request, context) {
  try {
    const assetId = request.params.assetid;

    if (!assetId) {
      throw new BadRequest('Missing asset ID');
    }

    if (request.method === 'POST') {
      const userId = request.params.userid;
      if (!userId) {
        throw new BadRequest('Missing user ID for assignment');
      }
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

    if (error instanceof NotFoundError) {
      return buildResponse(404, error.message);
    }

    const status = error.response?.status || 500;
    if (status === 400 || status === 404) {
      return buildResponse(
        404,
        'Unable to update assignment due to invalid assetid or userid',
      );
    } else if (status === 401) {
      return buildResponse(403, 'Unauthorized');
    }

    return buildResponse(status, 'Unable to update assignment');
  }
}

app.http('assignments', {
  methods: ['POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/assignments/{userid?}',
  handler: assignmentsHandler,
});
