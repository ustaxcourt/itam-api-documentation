
import axios from 'axios';

console.log('oauth loaded');

export async function exchangeAuthorizationCode(code, codeVerifier) {
  const { CLIENT_ID, TENANT_ID, REDIRECT_URI } = process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('client_id', CLIENT_ID);
  params.append('code', code);
  params.append('redirect_uri', REDIRECT_URI);
  params.append('code_verifier', codeVerifier);
  params.append('scope', 'openid profile offline_access https://yourorg.crm.dynamics.com/.default');

  try {
    const response = await axios.post(tokenUrl, params);
    return {
      accessToken: response.data.access_token,
      refreshToken: response.data.refresh_token,
      idToken: response.data.id_token,
      expiresIn: response.data.expires_in
    };
  } catch (error) {
    console.error('Error exchanging authorization code:', error.response?.data || error.message);
    throw error;
  }
}
