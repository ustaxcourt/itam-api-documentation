import axios from 'axios';
import { getToken } from './getToken';

export async function patchDatabase({ table, query }) {
  const url = `${DATAVERSE_URL}/api/data/v9.2/${table}`;

  const token = await getToken();

  // TODO: can we refactor away from axios and use Node's fetch?
  const result = await axios.patch(url, query, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      Prefer:
        'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
      'If-Match': '*',
    },
  });

  return result;
}
