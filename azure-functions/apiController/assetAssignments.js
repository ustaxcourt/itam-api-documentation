import { app } from '@azure/functions';
import { buildResponse } from '../apiController/returnResponse.js';
import { assignAssetToUser } from '../useCases/assignAssetToUser.js';
import { unassignAsset } from '../useCases/unassignAsset.js';

// ✅ Pulled-out named handler function
export async function assignmentsHandler(request, context) {
  try {
    const assetId = request.params.assetid;

    if (request.method === 'POST') {
      const userId = request.params.userid;
      await assignAssetToUser(userId, assetId);
    } else if (request.method === 'DELETE') {
      await unassignAsset(assetId);
    } else {
      throw new Error('Invalid REST Method');
    }

    return await buildResponse(
      200,
      'Successfully updated item assignment',
      assetId,
    );
  } catch (error) {
    context.error(
      'Unable to update assignments',
      error.response?.data || error.message,
    );

    if (error.response?.status === 400 || error.response?.status === 204) {
      return await buildResponse(
        404,
        'Unable to update assignment due to invalid assetid or userid',
      );
    } else if (error.response?.status === 401) {
      return await buildResponse(403, 'Unauthorized');
    } else {
      return await buildResponse(
        error.response?.status,
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
