import { app } from '@azure/functions';
import { assignAssetToUser } from '../src/useCases/assignAssetToUser.js';

const { DATAVERSE_URL } = process.env;

app.http('assignments', {
  methods: ['POST'],
  authLevel: 'anonymous',
  route: 'v1/assets/{assetid}/assignments/{userid}',
  handler: async (request, context) => {
    try {
      const assetId = request.params.assetid;
      if (request.method === 'POST') {
        const userId = request.params.userid;
        await assignAssetToUser({ assetId, userId });
      }
    } catch (error) {
      const status =
        error.response?.status === 400 ? 404 : error.response?.status || 500;
      context.error(
        'Unable to update assignments',
        error.response?.data || error.message,
      );

      return {
        status,
        jsonBody: {
          error: 'Unable to update assignment',
          details:
            (status === 404
              ? 'invalid itemId or userId'
              : error.response?.data?.error?.message) || error.message,
        },
      };
    }
  },
});
