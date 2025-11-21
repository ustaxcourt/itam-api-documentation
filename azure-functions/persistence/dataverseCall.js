import { getDataverseAccessToken } from './getDataverseAccessToken.js';

export async function dataverseCall(url, method, body = null) {
  const token = await getDataverseAccessToken();

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    Prefer:
      'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
  };

  const options = { method, headers };

  if (method === 'PATCH' || method === 'POST') {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }
  if (method === 'PATCH') {
    options.headers['If-Match'] = '*';
  }

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Dataverse API error:', errorData);
      throw new Error(`Dataverse call failed with status ${response.status}`);
    }

    // Handle empty body (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Fetch error in dataverseCall:', error.message);
    throw error;
  }
}
