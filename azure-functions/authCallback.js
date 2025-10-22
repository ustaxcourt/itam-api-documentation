import { app } from '@azure/functions';
import { PublicClientApplication } from '@azure/msal-node';
import { getCodeVerifier } from './getCodeVerifier.js';

export async function authCallback(request, context) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    return { status: 400, body: 'Missing code or state.' };
  }

  const codeVerifier = await getCodeVerifier(state);
  const redirectUri = `https://${request.headers.get('host')}/api/auth-callback`;

  const msalClient = new PublicClientApplication({
    auth: {
      clientId: process.env.CLIENT_ID,
      authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`
    }
  });

  try {
    const tokenResponse = await msalClient.acquireTokenByCode({
      code,
      scopes: ['User.Read', 'offline_access'],
      redirectUri,
      codeVerifier
    });

    const userEmail = tokenResponse.account.username;
    const refreshToken = tokenResponse.refreshToken;

    // Encrypt and store refresh token securely

    return {
      status: 200,
      body: `User ${userEmail} authenticated successfully.`
    };
  } catch (error) {
    context.log('Auth callback error:', error.message);
    return { status: 500, body: 'Authentication failed.' };
  }
}

app.http('auth-callback', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authCallback
});
