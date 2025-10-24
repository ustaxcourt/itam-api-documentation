import { app } from '@azure/functions';

export async function authTest(req, context) {
  // Log all headers for debugging
  context.log('Incoming headers:', req.headers);

  // Extract access token from Easy Auth
  const accessToken = req.headers['x-ms-token-aad-access-token'];

  if (!accessToken) {
    return {
      status: 401,
      jsonBody: {
        error: 'Access token not found. Ensure Easy Auth is enabled and user is authenticated.'
      }
    };
  }

  return {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    jsonBody: {
      accessToken,
      message: 'Access token retrieved successfully. Check logs for full headers.'
    }
  };
}

// Register the function with Azure Functions runtime
app.http('authTest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authTest
});
