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

    // Decode the token to inspect scopes
    const payload = JSON.parse(Buffer.from(accessToken.split('.')[1], 'base64').toString());

    context.log('✅ Access token received');
    context.log('🔍 Token scopes:', payload.scp);

    return {
      status: 200,
      body: {
        message: '✅ You are authenticated!',
        scopes: payload.scp,
        token: accessToken
      }
    };
  }
});
