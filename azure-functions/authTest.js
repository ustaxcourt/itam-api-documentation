export async function authTest(request, context) {
  const accessToken = request.headers['x-ms-token-aad-access-token'];

  if (!accessToken) {
    return {
      status: 401,
      body: 'Unauthorized: No access token found.'
    };
  }

  return {
    status: 200,
    body: {
      message: '✅ You are authenticated!',
      token: accessToken
    }
  };
}
