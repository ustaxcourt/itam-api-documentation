import axios from 'axios';
import { getDataverseAccessToken } from './getDataverseAccessToken.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { BadRequest } from '../errors/BadRequest.js';

export async function dataverseCall(url, method, body = null) {
  try {
    const token = await getDataverseAccessToken();
    if (!token) {
      throw new DataverseTokenError('No token found');
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
  } catch {
    throw new BadRequest('Unable to retreive from internal database');
  }
}
