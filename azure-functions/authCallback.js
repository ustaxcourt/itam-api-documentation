import { app } from '@azure/functions';
import { PublicClientApplication } from '@azure/msal-node';
import { getCodeVerifier } from './getCodeVerifier.js';

export async function authCallback(request, context) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');

  if (!code || !state) {
    context.log.error('Missing code or state in callback.');
    return { status: 400, body: 'Missing code or state.' };
  }

  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.CLIENT_ID;
  const tenantId = process.env.TENANT_ID;

  if (!redirectUri || !clientId || !tenantId) {
    context.log.error('Missing required environment variables.');
    return { status: 500, body: 'Server misconfiguration.' };
  }

  let codeVerifier;
  try {
    codeVerifier = await getCodeVerifier(state);
    if (!codeVerifier) {
      throw new Error('Code verifier not found for state.');
    }
  } catch (err) {
    context.log.error('Failed to retrieve code verifier:', err);
    return { status: 400, body: 'Invalid or expired login session.' };
  }

  const msalClient = new PublicClientApplication({
    auth: {
      clientId,
      authority: `https://login.microsoftonline.com/${tenantId}`
    }
  });

  try {
    const tokenResponse = await msalClient.acquireTokenByCode({
      code,
      scopes: ['User.Read', 'offline_access'],
      redirectUri,
      codeVerifier
    });

    const userEmail = tokenResponse.account?.username || 'unknown';

    context.log.info('User authenticated:', userEmail);

    return {
      status: 200,
      body: `User ${userEmail} authenticated successfully.`
    };

  } catch (error) {
    context.log.error('Auth callback error:', error);
    return {
      status: 500,
      body: `Authentication failed: ${error.message || 'Unknown error'}`
    };
  }
}

app.http('authCallback', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authCallback
});
