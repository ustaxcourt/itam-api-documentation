import { DataverseTokenError } from '../errors/DataverseTokenError';

export async function getDataverseAccessToken() {
  const {
    DATAVERSE_CLIENT_ID_PROD,
    TENANT_ID,
    DATAVERSE_INTERNAL_PROD,
    SCOPE_DATAVERSE_LOCAL_PROD,
  } = process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', DATAVERSE_CLIENT_ID_PROD);
  params.append('client_secret', DATAVERSE_INTERNAL_PROD);
  params.append('grant_type', 'client_credentials');
  params.append('scope', SCOPE_DATAVERSE_LOCAL_PROD);

  try {
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error getting OAuth token:', errorData);
      throw new DataverseTokenError(
        'Error attempting to retrieve token from Identity Provider',
      );
    }

    const data = await response.json();
    if (data.access_token) {
      return data.access_token;
    }

    throw new DataverseTokenError('Unable to get token from Identity Provider');
  } catch (error) {
    console.error('Fetch error:', error.message);
    throw new DataverseTokenError(
      'Error attempting to retrieve token from Identity Provider',
    );
  }
}
