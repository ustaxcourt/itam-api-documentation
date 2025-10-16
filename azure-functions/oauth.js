
import axios from 'axios';

console.log('oauth loaded');


export async function getToken(clientSecret) {
  const { CLIENT_ID, TENANT_ID, DATAVERSE_URL, SCOPE } = process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', clientSecret);
  params.append('grant_type', 'client_credentials');
  params.append('scope', SCOPE || `${DATAVERSE_URL}/.default`);

  try {
    const response = await axios.post(tokenUrl, params);
    return response.data.access_token;
  } catch (error) {
    console.error('Error getting OAuth token:', error.response?.data || error.message);
    throw error;
  }
}
