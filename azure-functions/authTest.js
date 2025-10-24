export const authTest = async (context, req) => {
  // Log all headers for debugging
  context.log('Incoming headers:', req.headers);

  // Extract access token from Easy Auth
  const accessToken = req.headers['x-ms-token-aad-access-token'];

  if (!accessToken) {
    context.res = {
      status: 401,
      body: {
        error: 'Access token not found. Ensure Easy Auth is enabled and user is authenticated.'
      }
    };
    return;
  }

  // Return access token and optionally other useful headers
  context.res = {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
    body: {
      accessToken,
      message: 'Access token retrieved successfully. Check logs for full headers.'
    }
  };
};

// App Registration-style declaration for central index.js
export const app = {
  http: {
    route: 'authTest',
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: authTest
  }
};
