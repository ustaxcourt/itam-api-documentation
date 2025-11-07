import axios from 'axios';

console.log('oauth loaded');

let cachedToken;

export async function getToken() {
  // TODO: don't know if this cachedToken logic is correct. is `expiry` a property of the token?
  if (cachedToken && cachedToken.expiry > Date.now()) {
    return cachedToken.access_token;
  }

  const { CLIENT_ID, TENANT_ID, DATAVERSE_INTERNAL, SCOPE } = process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', DATAVERSE_INTERNAL);
  params.append('grant_type', 'client_credentials');
  params.append('scope', SCOPE);

  try {
    const response = await axios.post(tokenUrl, params);
    cachedToken = response.data;
    console.log('OAuth token received:\n', response.data);
    return response.data.access_token;
  } catch (error) {
    console.error(
      'Error getting OAuth token:',
      error.response?.data || error.message,
    );
    throw error;
  }
}
