import { app } from '@azure/functions';
import { exchangeAuthorizationCode } from './oauth.js';

app.http('authCallback', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const code = request.query.get('code');
      const codeVerifier = request.query.get('code_verifier'); // You may need to pass this securely

      if (!code || !codeVerifier) {
        return {
          status: 400,
          jsonBody: {
            error: 'Missing code or code_verifier',
            details: 'Authorization code and PKCE code verifier are required.'
          }
        };
      }

      const tokenData = await exchangeAuthorizationCode(code, codeVerifier);

      // TODO: Store refreshToken securely or issue a session token
      return {
        status: 200,
        jsonBody: {
          message: 'Token exchange successful',
          accessToken: tokenData.accessToken,
          expiresIn: tokenData.expiresIn
        }
      };
    } catch (error) {
      context.error('Auth callback error:', error.message);
      return {
        status: 500,
        jsonBody: {
          error: 'Token exchange failed',
          details: error.message
        }
      };
    }
  }
});
