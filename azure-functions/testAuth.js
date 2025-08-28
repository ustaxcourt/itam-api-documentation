// testAuth.js
import { app } from '@azure/functions';
import { getToken } from './oauth.js';

console.log('Function testauth loaded');

app.http('testAuth', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const token = await getToken();
      return {
        status: 200,
        jsonBody: {
          message: 'OAuth token retrieved successfully.',
          token
        }
      };
    } catch (error) {
      context.error('OAuth error:', error);
      return {
        status: 500,
        jsonBody: {
          error: 'Failed to retrieve token',
          details: error.message
        }
      };
    }
  }
});
