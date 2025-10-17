import { app } from '@azure/functions';
import { exchangeAuthorizationCode } from './oauth.js';

function parseJwt(token) {
  const [, payload] = token.split('.');
  return JSON.parse(Buffer.from(payload, 'base64').toString());
}

app.http('authCallback', {
  methods: ['POST'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const { code, code_verifier } = await request.json();

      if (!code || !code_verifier) {
        return {
          status: 400,
          jsonBody: {
            error: 'Missing code or code_verifier'
          }
        };
      }

      const tokenData = await exchangeAuthorizationCode(code, code_verifier);
      const userInfo = parseJwt(tokenData.idToken);
      const userId = userInfo.oid || userInfo.email || 'unknown-user';

      await fetch('http://localhost:7071/api/storeTokens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          accessToken: tokenData.accessToken,
          refreshToken: tokenData.refreshToken,
          expiresIn: tokenData.expiresIn
        })
      });

      return {
        status: 200,
        jsonBody: {
          message: 'Token exchange and storage successful',
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
