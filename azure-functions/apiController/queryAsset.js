import { app } from '@azure/functions';
import { getAssetDetails } from '../useCases/getAssetDetails.js';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function queryAssetHandler(request, context) {
  try {
    const id = request.params.itemid;
    const dictionary = await getAssetDetails(id);

    if (!dictionary || Object.keys(dictionary).length === 0) {
      throw new NotFoundError('Dataverse query failed');
    }

    return buildResponse(200, 'Success', dictionary);
  } catch (error) {
    context.error('Dataverse query error:', error.message);

    if (error instanceof NotFoundError) {
      return buildResponse(404, error.message);
    }

    if (error.response?.status === 404) {
      return buildResponse(404, 'Dataverse query failed');
    }

    return buildResponse(500, 'Dataverse query failed', error.message);
  }
}

app.http('queryAsset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}',
  handler: queryAssetHandler,
});
