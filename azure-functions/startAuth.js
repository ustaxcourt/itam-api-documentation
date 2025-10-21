import { app } from '@azure/functions';
import crypto from 'crypto';

const { CLIENT_ID, TENANT_ID, REDIRECT_URI, SCOPE } = process.env;

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('hex');
}

function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return hash.toString('base64url');
}

app.http('startAuth', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      if (!CLIENT_ID || !TENANT_ID || !REDIRECT_URI || !SCOPE) {
        context.log.error('Missing environment variables');
        return {
          status: 500,
          body: 'Missing CLIENT_ID, TENANT_ID, REDIRECT_URI, or SCOPE in environment settings.'
        };
      }

      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      const authorizeUrl =
        `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?` +
        `client_id=${CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&response_mode=query` +
        `&scope=${encodeURIComponent(SCOPE)}` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256`;

      // Debugging logs
      context.log.info('Generated code_verifier:', codeVerifier);
      context.log.info('Generated code_challenge:', codeChallenge);
      context.log.info('Redirecting to:', authorizeUrl);

      return {
        status: 302,
        headers: {
          Location: authorizeUrl,
          'Set-Cookie': `code_verifier=${codeVerifier}; Path=/; Secure; HttpOnly; SameSite=None`
        }
      };
    } catch (error) {
      context.log.error('startAuth error:', error.message);
      return {
        status: 500,
        body: 'Internal Server Error'
      };
    }
  }
});
