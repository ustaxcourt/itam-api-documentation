import axios from 'axios';
console.log('Function oauth loaded');


/**
 * Exchanges an authorization code for access and refresh tokens using PKCE.
 */
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

  const response = await axios.post(tokenUrl, params);
  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    idToken: response.data.id_token,
    expiresIn: response.data.expires_in
  };
}

/**
 * Uses a refresh token to obtain a new access token.
 */
export async function getToken(refreshToken) {
  const { CLIENT_ID, TENANT_ID } = process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('client_id', CLIENT_ID);
  params.append('refresh_token', refreshToken);
  params.append('scope', 'openid profile offline_access https://yourorg.crm.dynamics.com/.default');

  const response = await axios.post(tokenUrl, params);
  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in
  };
}

/**
 * (Optional) Checks if a JWT access token is expired.
 */
export function isTokenExpired(token) {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString());
    const now = Math.floor(Date.now() / 1000);
    return decoded.exp < now;
  } catch (error) {
    console.error('Failed to decode token:', error.message);
    return true;
  }
}

/**
 * (Optional) Ensures a valid access token, refreshing if needed.
 */
export async function ensureValidAccessToken(currentToken, refreshToken) {
  if (!currentToken || isTokenExpired(currentToken)) {
    const newTokens = await getToken(refreshToken);
    return newTokens.accessToken;
  }
  return currentToken;
}
