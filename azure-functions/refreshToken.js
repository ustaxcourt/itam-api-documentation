import { app } from '@azure/functions';
import { PublicClientApplication } from '@azure/msal-node';
import { TableClient } from '@azure/data-tables';
import crypto from 'crypto';

const {
  CLIENT_ID,
  TENANT_ID,
  AzureWebJobsStorage,
  TABLE_NAME,
  SCOPE,
  ENCRYPTION_KEY
} = process.env;

function decrypt(encryptedText) {
  const [ivHex, encrypted] = encryptedText.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

const msalClient = new PublicClientApplication({
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`
  }
});

const tableClient = TableClient.fromConnectionString(AzureWebJobsStorage, TABLE_NAME);

export async function refreshToken(request, context) {
  try {
    const userEmail = request.query.get('email');
    if (!userEmail) {
      return { status: 400, body: 'Missing email parameter.' };
    }

    const entity = await tableClient.getEntity('UserTokens', userEmail);
    const encryptedToken = entity.refreshToken;
    const refreshToken = decrypt(encryptedToken);

    const refreshed = await msalClient.acquireTokenByRefreshToken({
      refreshToken,
      scopes: ['User.Read']
    });

    return {
      status: 200,
      body: {
        message: 'Token refreshed successfully.',
        accessToken: refreshed.accessToken
      }
    };
  } catch (error) {
    context.log('Refresh error:', error.message);
    return {
      status: 500,
      body: 'Token refresh failed.'
    };
  }
}

app.http('refreshToken', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: refreshToken
});
