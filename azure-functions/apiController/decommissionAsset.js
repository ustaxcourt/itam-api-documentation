import { app } from '@azure/functions';
import { BadRequest } from '../errors/BadRequest.js';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { patchAppHttp } from '../useCases/maintenanceMode.js';
import { decommissionWrapper } from '../useCases/decommissionWrapper.js';

export async function decommissionAssetHandler(request, context) {
  try {
    const id = request.params.itemid;
    if (!id) {
      throw new BadRequest('Missing Asset ID');
    }

    if (request.method === 'PATCH') {
      await decommissionWrapper(id);
      return buildResponse(200, 'Successfully decommissioned asset', id);
    } else {
      throw new BadRequest('Invalid REST Method');
    }
  } catch (error) {
    if (error instanceof BadRequest) {
      return buildResponse(400, error.message);
    }
    if (error instanceof NotFoundError) {
      return buildResponse(404, error.message);
    }
    context.error(
      'Unable to decommission the asset',
      error.response?.data || error.message,
    );
    // add in internal error catch all in ors? like || Internal Server error and || 500?
    return buildResponse(error.statusCode, error.message);
  }
}

patchAppHttp(app);

app.http('decommissionAsset', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}/decommission',
  handler: decommissionAssetHandler,
});
