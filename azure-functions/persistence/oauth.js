export async function getToken() {
  const { CLIENT_ID, TENANT_ID, DATAVERSE_INTERNAL, SCOPE } = process.env;

  const tokenUrl = `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`;

  const params = new URLSearchParams();
  params.append('client_id', CLIENT_ID);
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
      const errorData = await response.text();
      throw new Error(`Error getting OAuth token: ${errorData}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error(
      'Error getting OAuth token:',
      error.message || error.response?.data,
    );
    throw error;
  }
}
