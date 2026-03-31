import { app } from '@azure/functions';
import { BadRequest } from '../errors/BadRequest.js';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { patchAppHttp } from '../useCases/maintenanceMode.js';
import { recommissionWrapper } from '../useCases/recommissionWrapper.js';

export async function recommissionAssetHandler(request, context) {
  try {
    const id = request.params.itemid;
    if (!id) {
      throw new BadRequest('Missing Asset ID');
    }

    if (request.method === 'PATCH') {
      await recommissionWrapper(id);
      return buildResponse(200, 'Successfully recommissioned asset', id);
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
      'Unable to recommission the asset',
      error.response?.data || error.message,
    );

    return buildResponse(
      error.statusCode ?? 500,
      error.message ?? 'Internal Server Error',
    );
  }
}

patchAppHttp(app);

app.http('recommissionAsset', {
  methods: ['PATCH'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}/recommission',
  handler: recommissionAssetHandler,
});
