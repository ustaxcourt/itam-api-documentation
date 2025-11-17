import { getToken } from '../oauth.js';

export async function dataverseTokenHandler() {
  const token = await getToken();
  if (!token) {
    return {
      status: 403,
      jsonBody: {
        error: 'Unauthorized',
        details: 'Dataverse internal token is missing or invalid.',
      },
    };
  }
  return token;
}
