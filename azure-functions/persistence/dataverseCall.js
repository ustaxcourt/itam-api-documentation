import { getDataverseAccessToken } from './getDataverseAccessToken.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function dataverseCall({
  query,
  method,
  body = null,
  responseMode = 'default',
}) {
  const token = await getDataverseAccessToken();
  if (!process.env.DATAVERSE_URL) {
    throw new InternalServerError('DATAVERSE_URL is missing');
  }

  const url = `${process.env.DATAVERSE_URL}/${query}`;
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
      const errorMessage =
        errorData?.error?.message ??
        `Dataverse call failed with status ${response.status}`;

      // Dataverse explicitly returned 404 (entity does not exist)
      if (response.status === 404) {
        throw new NotFoundError(errorMessage);
      }

      // Dataverse OData errors (GUID / type mismatch, etc.)
      if (
        errorMessage.includes('incompatible types') ||
        errorMessage.includes('Edm.Guid') ||
        errorMessage.includes('Resource not found') ||
        errorMessage.includes('does not exist') ||
        errorMessage.includes('expected at position') ||
        errorMessage.includes("')' or ',' expected")
      ) {
        throw new NotFoundError('Resource not found');
      }
      // Preserves other HTTP status codes
      console.error('Dataverse API error:', errorData);
      const err = new Error(errorMessage);
      err.statusCode = response.status;
      throw err;
    }

    // Collect headers (always safe; never forwarded)
    const allHeaders = {};
    response.headers.forEach((value, key) => {
      allHeaders[key] = value;
    });

    // Handle empty body (204 No Content)
    if (response.status === 204) {
      const entityUrl =
        response.headers.get('OData-EntityId') ||
        response.headers.get('odata-entityid');

      const id = entityUrl?.match(/\(([^)]+)\)/)?.[1] ?? null;

      if (responseMode === 'id') {
        return { id };
      }

      if (responseMode === 'headers') {
        return { id, headers: allHeaders };
      }

      // Backwards compatible
      return null;
    }

    // For non-204 (GET, etc.)
    const data = await response.json();

    if (responseMode === 'headers') {
      return { ...data, headers: allHeaders };
    }

    return data;
  } catch (error) {
    console.error('Fetch error in dataverseCall:', error.message);
    throw error;
  }
}
