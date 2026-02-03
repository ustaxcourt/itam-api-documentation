import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { assignAssetToUser } from '../useCases/assignAssetToUser.js';
import { unassignAsset } from '../useCases/unassignAsset.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { AUDIT_LOG_CHOICES } from '../entityConstants.js';

export async function assignmentsHandler(request, context) {
  try {
    const assetId = request.params.assetid;
    const userId = request.params.userid;
    let body;
    if (!assetId) {
      throw new BadRequest('Missing asset ID');
    }

    try {
      body = await request.json();
    } catch (error) {
      console.log(error);
      throw new BadRequest('Missing body within request');
    }

    //Verifies if there even is a body (null and undefined are falsey) then checks if zendeskTicketId is available
    if (!body || !Object.hasOwn(body, 'zendeskTicketId')) {
      throw new BadRequest(
        'Missing required zendeskTicketId in body of request',
      );
    }

    if (typeof body.zendeskTicketId !== 'number') {
      throw new BadRequest('zendeskTicketId must be number');
    }

    // Verifies that body has a 'condition' property
    if (!Object.hasOwn(body, 'condition')) {
      throw new BadRequest('Missing required condition in body of request');
    }
    // Verifies that body.condition is a valid condition
    if (!(body.condition.trim() in AUDIT_LOG_CHOICES)) {
      throw new BadRequest(`Invalid condition '${body.condition}'`);
    }

    // If the above validations pass, then we can POST / DELETE
    if (request.method === 'POST') {
      if (!userId) {
        throw new BadRequest('Missing user ID for assignment');
      }
      await assignAssetToUser(userId, assetId, body);
    } else if (request.method === 'DELETE') {
      await unassignAsset(assetId, body);
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

console.log('[endpoint] module loaded');
console.log('[endpoint] typeof app.http =', typeof app.http);

app.http('assignments', {
  methods: ['POST', 'DELETE'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/assignments/{userid?}',
  handler: assignmentsHandler,
});
