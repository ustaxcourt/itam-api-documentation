import { app } from '@azure/functions';
import { TableClient, AzureNamedKeyCredential } from "@azure/data-tables";
import { DefaultAzureCredential } from '@azure/identity';


const storageAccountName = process.env.STORAGE_ACCOUNT_NAME;

const tableName = "UserTokens";
const accountUrl = `https://${storageAccountName}.table.core.windows.net`;

const credential = new DefaultAzureCredential();
const client = new TableClient(accountUrl, tableName, credential);

app.http('storeTokens', {
  methods: ['POST'],
  authLevel: 'function',
  handler: async (request, context) => {
    try {
      const { userId, accessToken, refreshToken, expiresIn } = await request.json();

      if (!userId || !accessToken || !refreshToken || !expiresIn) {
        return {
          status: 400,
          jsonBody: { error: 'Missing required fields' }
        };
      }

      const entity = {
        partitionKey: 'tokens',
        rowKey: userId,
        accessToken,
        refreshToken,
        expiresIn: String(expiresIn),
        timestamp: new Date().toISOString()
      };

      await client.upsertEntity(entity, "Merge");

      return {
        status: 200,
        jsonBody: { message: 'Tokens stored successfully' }
      };
    } catch (error) {
      context.error('Error storing tokens:', error.message);
      return {
        status: 500,
        jsonBody: { error: 'Failed to store tokens', details: error.message }
      };
    }
  }
});
