import { app } from '@azure/functions';
import { PublicClientApplication, ConfidentialClientApplication } from '@azure/msal-node';
import { TableClient } from '@azure/data-tables';
import crypto from 'crypto';

const {
  CLIENT_ID,
  TENANT_ID,
  CLIENT_SECRET,
  AzureWebJobsStorage,
  TABLE_NAME,
  SCOPE,
  ENCRYPTION_KEY // 32-byte hex string
} = process.env;

// Encryption helpers
const ivLength = 16;

function encrypt(text) {
  const iv = crypto.randomBytes(ivLength);
  const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex'), iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return `${iv.toString('hex')}:${encrypted}`;
}

// MSAL clients
const publicClientApp = new PublicClientApplication({
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`
  }
});

const confidentialClientApp = new ConfidentialClientApplication({
  auth: {
    clientId: CLIENT_ID,
    authority: `https://login.microsoftonline.com/${TENANT_ID}`,
    clientSecret: CLIENT_SECRET
  }
});

const tableClient = TableClient.fromConnectionString(AzureWebJobsStorage, TABLE_NAME);

export async function login(request, context) {
  try {
    const deviceCodeRequest = {
      scopes: ['User.Read', 'offline_access'],
      deviceCodeCallback: (response) => {
        context.log(`DEVICE CODE MESSAGE:\n${response.message}`);
      }
    };

    const userAuth = await publicClientApp.acquireTokenByDeviceCode(deviceCodeRequest);
    const userEmail = userAuth.account.username;
    const refreshToken = userAuth.refreshToken;

    if (!userEmail.endsWith('@yourdomain.com')) {
      return { status: 403, body: 'User not authorized.' };
    }

    const encryptedToken = encrypt(refreshToken);

    await tableClient.upsertEntity({
      partitionKey: 'UserTokens',
      rowKey: userEmail,
      refreshToken: encryptedToken,
      timestamp: new Date().toISOString()
    });

    const backendAuth = await confidentialClientApp.acquireTokenByClientCredential({
      scopes: [SCOPE]
    });

    return {
      status: 200,
      body: {
        message: `User ${userEmail} authenticated.`,
        dataverseToken: backendAuth.accessToken
      }
    };
  } catch (error) {
    context.log('Login error:', error.message);
    return {
      status: 500,
      body: 'Login failed.'
    };
  }
}

app.http('login', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: login
});
