import { app } from '@azure/functions';
import { PublicClientApplication } from '@azure/msal-node';

const config = {
  auth: {
    clientId: process.env.CLIENT_ID,
    authority: `https://login.microsoftonline.com/${process.env.TENANT_ID}`
  }
};

const msalInstance = new PublicClientApplication(config);

app.http('startAuth', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      const deviceCodeRequest = {
        scopes: [
          'openid',
          'profile',
          'offline_access',
          'https://yourorg.crm.dynamics.com/user_impersonation'
        ],
        deviceCodeCallback: (response) => {
          // This message tells the user how to authenticate
          context.log(`\nDEVICE CODE MESSAGE:\n${response.message}\n`);
        }
      };

      const authResult = await msalInstance.acquireTokenByDeviceCode(deviceCodeRequest);

      context.log('Access Token:', authResult.accessToken);

      return {
        status: 200,
        body: {
          message: 'Authentication successful. You can now use the access token to call Dataverse.',
          accessToken: authResult.accessToken
        }
      };
    } catch (error) {
      context.log('Authentication error:', error.message);
      return {
        status: 500,
        body: 'Authentication failed. Check logs for details.'
      };
    }
  }
});
