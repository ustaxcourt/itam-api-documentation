import axios from 'axios';
import { getDataverseAccessToken } from './getDataverseAccessToken.js';

export async function dataverseCall(url, method, body = null) {
  const token = await getDataverseAccessToken();
  if (!token) {
    throw new Error('No token found');
  }

  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    Prefer:
      'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
  };

  if (method === 'PATCH') {
    return axios.patch(url, body, {
      headers: {
        ...headers,
        'If-Match': '*',
      },
    });
  } else if (method === 'GET') {
    return axios.get(url, { headers });
  }
}
