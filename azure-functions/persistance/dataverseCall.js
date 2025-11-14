import axios from 'axios';

export async function dataverseCall(token, url, method, body = null) {
  if (method == 'PATCH') {
    const response = await axios.patch(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        Prefer:
          'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
        'If-Match': '*',
      },
    });

    return response;
  } else if (method == 'GET') {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        Prefer:
          'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
      },
    });

    return response;
  }
}
