import { app, HttpRequest, InvocationContext } from '@azure/functions';
import { getAssetDetails } from '../useCases/getAssetDetails.js';
import { ApiResponse, buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';

// Uses built-in interfaces from Azure and our ApiResponse shape from buildResponse
export async function queryAssetHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<ApiResponse<Record<string, unknown>>> {
  try {
    const id = request.params.itemid;
    const dictionary = await getAssetDetails(id);

    if (!dictionary || Object.keys(dictionary).length === 0) {
      throw new NotFoundError(`Asset ${id} not found`);
    }

    return buildResponse(200, 'Success', dictionary);
  } catch (error) {
    if (error instanceof Error) {
      // Edge case handling to make sure we're dealing with error classes
      context.error('Dataverse query error:', error.message);

      if (error instanceof NotFoundError) {
        return buildResponse(404, error.message);
      }

      //instead of returning the error.message we're explicitly using null to keep the return type narrow
      return buildResponse(500, 'Dataverse query failed', null);
    }

    //Fall back to catch those edge cases
    context.error('Unknown error:', error);
    return buildResponse(500, 'Dataverse query failed');
  }
}

app.http('queryAsset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}',
  handler: queryAssetHandler,
});
