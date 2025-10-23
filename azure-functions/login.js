import { app } from '@azure/functions';
import crypto from 'crypto';
import { storeCodeVerifier } from './storeCodeVerifier.js';

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('base64url');
}

function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return Buffer.from(hash).toString('base64url');
}

export async function login(request, context) {
  context.log('🔔 Login function triggered');

  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.CLIENT_ID;
  const tenantId = process.env.TENANT_ID;

  // Validate environment variables
  if (!redirectUri || !clientId || !tenantId) {
    context.log.error('❌ Missing required environment variables:', {
      redirectUri,
      clientId,
      tenantId
    });
    return { status: 500, body: 'Server misconfiguration: missing environment variables.' };
  }

  let codeVerifier, codeChallenge;
  try {
    codeVerifier = generateCodeVerifier();
    codeChallenge = generateCodeChallenge(codeVerifier);
    context.log('✅ PKCE values generated:', { codeVerifier, codeChallenge });
  } catch (err) {
    context.log.error('❌ Error generating PKCE values:', err);
    return { status: 500, body: 'Failed to generate secure login parameters.' };
  }

  const state = crypto.randomUUID();
  context.log('🆔 Generated state:', state);

  try {
    await storeCodeVerifier(state, codeVerifier);
    context.log('✅ Code verifier stored successfully for state:', state);
  } catch (err) {
    context.log.error('❌ Failed to store code verifier:', err);
    return { status: 500, body: 'Failed to initiate login session.' };
  }

  const authUrl = new URL(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`);
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_mode', 'query');
  authUrl.searchParams.set('scope', 'User.Read offline_access');
  authUrl.searchParams.set('code_challenge', codeChallenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');
  authUrl.searchParams.set('state', state);

  context.log('➡️ Redirecting to Azure AD:', authUrl.toString());

  return {
    status: 302,
    headers: {
      Location: authUrl.toString()
    }
  };
}

app.http('login', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: login
});
``
