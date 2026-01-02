import { DataverseTokenError } from '../errors/DataverseTokenError.js';

// We only need to model the fact a successful response has an access_token property
type TokenResponse = { access_token?: string };

// Promise returns the token string
export async function getDataverseAccessToken(): Promise<string> {
  const { DATAVERSE_CLIENT_ID, TENANT_ID, DATAVERSE_INTERNAL, SCOPE } =
    process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', DATAVERSE_CLIENT_ID);
  params.append('client_secret', DATAVERSE_INTERNAL);
  params.append('grant_type', 'client_credentials');
  params.append('scope', SCOPE);

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

    // Narrows data to ensure it fits the expected shape (having access_token)
    const data = (await response.json()) as TokenResponse;
    if (data.access_token) {
      return data.access_token;
    }

    throw new DataverseTokenError('Unable to get token from Identity Provider');
  } catch (error) {
    console.error(
      'Fetch error:',
      error instanceof Error ? error.message : error,
    );
    throw new DataverseTokenError(
      'Error attempting to retrieve token from Identity Provider',
    );
  }
}
