import { app } from '@azure/functions';

app.http('authTest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'authTest',
  handler: async (request, context) => {
    const accessToken = request.headers['x-ms-token-aad-access-token'];

    if (!accessToken) {
      context.log('❌ No access token found in headers');
      return {
        status: 401,
        body: 'Unauthorized: No access token found.'
      };
    }

    context.log('✅ Access token received');
    return {
      status: 200,
      body: {
        message: '✅ You are authenticated!',
        accessToken
      }
    };
  }
});
