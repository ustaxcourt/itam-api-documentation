import { getToken } from '../oauth.js';

export async function dataverseTokenHandler() {
  const token = await getToken();
  if (!token) {
    throw new Error('no token found');
  }
  return token;
}
