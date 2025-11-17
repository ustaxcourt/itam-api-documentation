import { app } from '@azure/functions';
import { getAssetDetails } from './useCases/getAssetDetails.js';
import { buildResponse } from './useCases/returnResponse.js';

app.http('queryAsset', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/assets/{itemid}',
  handler: async (request, context) => {
    try {
      const id = request.params.itemid;

      // Delegate logic to use case
      const dictionary = await getAssetDetails(id);

      if (!dictionary || Object.keys(dictionary).length === 0) {
        return buildResponse(404, 'Dataverse query failed');
      }

      return buildResponse(200, 'Success', dictionary);
    } catch (error) {
      const status = error.response?.status || 500;
      context.error('Dataverse query error:', error.message);

      return buildResponse(status, 'Dataverse query failed', error.message);
    }
  },
});
