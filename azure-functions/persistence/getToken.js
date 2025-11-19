import axios from 'axios';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

export async function getToken() {
  const { CLIENT_ID, TENANT_ID, DATAVERSE_INTERNAL, SCOPE } = process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
  params.append('client_secret', DATAVERSE_INTERNAL);
  params.append('grant_type', 'client_credentials');
  params.append('scope', SCOPE);

  try {
    const response = await axios.post(tokenUrl, params);
    if (response.data.access_token) {
      return response.data.access_token;
    }

    throw new DataverseTokenError('Unable to get token from Identity Provider');
  } catch (error) {
    console.error(
      'Error getting OAuth token:',
      error.response?.data || error.message,
    );
    throw new DataverseTokenError(
      'Error attempting to retrieve token from Identity Provider',
    );
  }
}
