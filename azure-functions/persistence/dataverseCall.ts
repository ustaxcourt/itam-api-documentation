import { getDataverseAccessToken } from './getDataverseAccessToken.js';
import { InternalServerError } from '../errors/InternalServerError.js';

// Clean shape for the input arguments
type DataverseCallArgs = {
  query: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
};

// T is a caller defined shape
// The promise either returns the shape 'T' or null (for 204s)
// callers that don't care about the response can use Promise<void> safely
export async function dataverseCall<T = unknown>({
  query,
  method,
  body = null,
}: DataverseCallArgs): Promise<T | null> {
  const token = await getDataverseAccessToken();
  if (!process.env.DATAVERSE_URL) {
    throw new InternalServerError('DATAVERSE_URL is missing');
  }

  const url = `${process.env.DATAVERSE_URL}/${query}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json',
    Prefer:
      'odata.include-annotations="OData.Community.Display.V1.FormattedValue"',
  };

  // RequestInit is a built-in defined TS interface for fetch options
  const options: RequestInit = { method, headers };

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

    // Cast the response to shape 'T' to align with our declared return type
    return response.json() as T;
  } catch (error) {
    console.error(
      'Fetch error in dataverseCall:',
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
}
