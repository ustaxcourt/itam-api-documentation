import { app, HttpRequest, InvocationContext } from '@azure/functions';
import { ApiResponse, buildResponse } from './buildResponse.js';
import { assignAssetToUser } from '../useCases/assignAssetToUser.js';
import { unassignAsset } from '../useCases/unassignAsset.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function assignmentsHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<ApiResponse<null>> {
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

    // Could re-add the assetID in the string message to preserve that information if desired
    return buildResponse(
      200,
      `Successfully updated item assignment for ${assetId}`,
      null,
    );
  } catch (error) {
    if (error instanceof BadRequest) {
      context.error('Bad request:', error.message);
      return buildResponse(400, error.message, null);
    }
    if (error instanceof NotFoundError) {
      context.error('Not found:', error.message);
      return buildResponse(404, error.message, null);
    }
    //Should consider adding an Unauthorized/Forbidden Error so this is less fragile
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      context.error('Unauthorized:', error.message);
      return buildResponse(401, error.message, null);
    }
    if (error instanceof Error) {
      context.error('Unable to update assignments:', error.message);
      return buildResponse(500, 'Unable to update assignments', null);
    }

    context.error('Unknown error:', error);
    return buildResponse(500, 'Unable to update assignments', null);
  }
}

app.http('assignments', {
  methods: ['POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/assignments/{userid?}',
  handler: assignmentsHandler,
});
