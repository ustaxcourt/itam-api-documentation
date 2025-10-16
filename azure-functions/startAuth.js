import { app } from '@azure/functions';
import crypto from 'crypto';

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('hex');
}

function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return hash.toString('base64url'); // base64url encoding
}

app.http('startAuth', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const { CLIENT_ID, TENANT_ID, REDIRECT_URI } = process.env;

    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);

    // Store codeVerifier in a cookie (or use encrypted query param/session)
    const cookie = `code_verifier=${codeVerifier}; Path=/; HttpOnly; Secure`;

    const authorizeUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?` +
      `client_id=${CLIENT_ID}` +
      `&response_type=code` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_mode=query` +
      `&scope=openid profile offline_access https://yourorg.crm.dynamics.com/.default` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    context.res = {
      status: 302,
      headers: {
        'Set-Cookie': cookie,
        'Location': authorizeUrl
      }
    };
  }
});
