import axios from 'axios';
import { getDataverseAccessToken } from './getDataverseAccessToken.js';
import { AppError } from '../errors/error.js';

export async function dataverseCall(url, method, body = null) {
  try {
    const token = await getDataverseAccessToken();
    if (!token) {
      throw new AppError(500, 'No token found', true);
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
  } catch (error) {
    if (error.passUp) {
      throw error;
    } else {
      throw new AppError(
        500,
        'Unable to retreive from internal database',
        false,
      );
    }
  }
}
