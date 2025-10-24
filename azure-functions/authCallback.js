import { app } from '@azure/functions';
import axios from 'axios';
import qs from 'qs';
import { retrieveCodeVerifier } from './storeCodeVerifier.js'; // Your storage module

export async function authCallback(request, context) {
  context.log('🔔 Callback function triggered');

  const { code, state } = request.query;

  if (!code || !state) {
    context.log.error('❌ Missing code or state in query');
    return { status: 400, body: 'Missing authorization code or state.' };
  }

  const redirectUri = process.env.REDIRECT_URI;
  const clientId = process.env.CLIENT_ID;
  const tenantId = process.env.TENANT_ID;

  let codeVerifier;
  try {
    codeVerifier = await retrieveCodeVerifier(state);
    if (!codeVerifier) {
      throw new Error('Code verifier not found for state');
    }
    context.log('✅ Retrieved code verifier for state:', state);
  } catch (err) {
    context.log.error('❌ Failed to retrieve code verifier:', err);
    return { status: 400, body: 'Invalid or expired login session.' };
  }

  const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  try {
    const tokenResponse = await axios.post(tokenUrl, qs.stringify({
      client_id: clientId,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, refresh_token, id_token, expires_in } = tokenResponse.data;

    context.log('✅ Token exchange successful');

    return {
      status: 200,
      body: {
        access_token,
        refresh_token,
        id_token,
        expires_in
      }
    };
  } catch (err) {
    context.log.error('❌ Token exchange failed:', err.response?.data || err.message);
    return { status: 500, body: 'Token exchange failed.' };
  }
}

app.http('authCallback', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authCallback
});
