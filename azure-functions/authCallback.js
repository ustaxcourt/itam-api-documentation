import { app } from '@azure/functions';
import { exchangeAuthorizationCode } from './oauth.js';

const storeTokensURL = process.env.STORETOKENS_FUNCTION_KEY;

function parseJwt(token) {
  const [, payload] = token.split('.');
  const padded = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
  return JSON.parse(Buffer.from(padded, 'base64').toString());
}

function getCookieValue(cookieHeader, name) {
  const cookies = cookieHeader?.split(';') || [];
  for (const cookie of cookies) {
    const [key, value] = cookie.trim().split('=');
    if (key === name) return decodeURIComponent(value);
  }
  return "null";
}

app.http('authCallback', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const code = request.query.get('code');
      const cookieHeader = request.headers['cookie'];
      const code_verifier = getCookieValue(cookieHeader, 'code_verifier');

      // Log incoming values for debugging
      context.log('🔍 Incoming query code:', code);
      context.log('🔍 Incoming cookie header:', cookieHeader);
      context.log('🔍 Parsed code_verifier:', code_verifier);

      if (!code || !code_verifier) {
        return {
          status: 400,
          jsonBody: {
            error: 'Missing code or code_verifier',
            received: {
              code,
              cookieHeader,
              code_verifier
            }
          }
        };
      }

      const tokenData = await exchangeAuthorizationCode(code, code_verifier);
      const userInfo = parseJwt(tokenData.idToken);
      const userId = userInfo.oid || userInfo.email || 'unknown-user';

      await fetch(storeTokensURL, {
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
      context.log.error('Auth callback error:', error.message);
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
