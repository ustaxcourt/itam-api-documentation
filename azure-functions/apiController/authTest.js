import { app } from '@azure/functions';
import { patchAppHttp } from '../useCases/maintenanceMode.js';

export async function authTest() {
  return {
    status: 200,
    jsonBody: {
      message: '✅ You are authenticated. Welcome!',
    },
  };
}

patchAppHttp(app);

app.http('authTest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authTest,
});
