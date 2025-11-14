import { getToken } from '../oauth.js';

export async function tokenHandler() {
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
