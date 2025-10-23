// File: connectivityTest.js
import { app } from '@azure/functions';
import https from 'https';

app.http('connectivityTest', {
  methods: ['GET'],
  authLevel: 'function',
  handler: async (request, context) => {
    return await new Promise((resolve) => {
      https.get('https://login.microsoftonline.com', (res) => {
        context.log(`✅ Connectivity test successful. Status: ${res.statusCode}`);
        resolve({
          status: res.statusCode,
          body: `✅ Connectivity test successful. Status: ${res.statusCode}`
        });
      }).on('error', (e) => {
        context.log(`❌ Connectivity test failed: ${e.message}`);
        resolve({
          status: 500,
          body: `❌ Connectivity test failed: ${e.message}`
        });
      });
    });
  }
});
