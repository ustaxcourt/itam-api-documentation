import { app } from '@azure/functions';
import { TableClient } from '@azure/data-tables';
import { DefaultAzureCredential } from '@azure/identity';
import axios from 'axios';

const tableName = "UserTokens";
const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;
const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;

const accountUrl = `https://${storageAccountName}.table.core.windows.net`;
const credential = new DefaultAzureCredential();
const tableClient = new TableClient(accountUrl, tableName, credential);

app.http('refreshToken', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request, context) => {
    try {
      const { userId } = await request.json();

      if (!userId) {
        return {
          status: 400,
          jsonBody: { error: 'Missing userId' }
        };
      }

      const entity = await tableClient.getEntity('tokens', userId);
      const refreshToken = entity.refreshToken;

      const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;
      const params = new URLSearchParams();
      params.append('grant_type', 'refresh_token');
      params.append('client_id', clientId);
      params.append('refresh_token', refreshToken);
      params.append('scope', 'openid profile offline_access https://yourorg.crm.dynamics.com/.default');

      const response = await axios.post(tokenUrl, params);
      const tokenData = response.data;

      return {
        status: 200,
        jsonBody: {
          message: 'Token refreshed successfully',
          accessToken: tokenData.access_token,
          expiresIn: tokenData.expires_in
        }
      };
    } catch (error) {
      context.error('Refresh token error:', error.message);
      return {
        status: 500,
        jsonBody: {
          error: 'Failed to refresh token',
          details: error.message
        }
      };
    }
  }
});
