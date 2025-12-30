import { app } from '@azure/functions';
import { getAssetDetails } from '../useCases/getAssetDetails';
import { buildResponse } from './buildResponse';
import { NotFoundError } from '../errors/NotFoundError';

export async function queryAssetHandler(request, context) {
  try {
    const id = request.params.itemid;
    const dictionary = await getAssetDetails(id);

    if (!dictionary || Object.keys(dictionary).length === 0) {
      throw new NotFoundError(`Asset ${id} not found`);
    }

    return buildResponse(200, 'Success', dictionary);
  } catch (error) {
    context.error('Dataverse query error:', error.message);

    if (error instanceof NotFoundError) {
      return buildResponse(404, error.message);
    }

    const status = error.response?.status || 500;
    return buildResponse(status, 'Dataverse query failed', error.message);
  }
}

app.http('queryAsset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}',
  handler: queryAssetHandler,
});
