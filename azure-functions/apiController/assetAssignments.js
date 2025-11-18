import { app } from '@azure/functions';
import { buildResponse } from '../apiController/returnResponse.js';
import { updateAssignment } from '../useCases/updateAssignment.js';

// ✅ Pulled-out named handler function
export async function assignmentsHandler(request, context) {
  try {
    await updateAssignment(request);

    return await buildResponse(
      200,
      'Successfully updated item assignment',
      request.params.assetid,
    );
  } catch (error) {
    context.error(
      'Unable to update assignments',
      error.response?.data || error.message,
    );
    //wrong userid or asset and we return a 404
    if (error.response?.status == 400) {
      return await buildResponse(
        404,
        'Unable to update assignment due to inavlid assetid or userid',
      );
    } else if (error.response?.status == 401) {
      return await buildResponse(403, 'Unauthorized');
    }

    if (error.response?.status == 204) {
      return await buildResponse(
        404,
        'Unable to update assignment due to inavlid assetid or userid boop',
      );
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
