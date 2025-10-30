import { app } from '@azure/functions';

export async function authTest(req, context) {
  return {
    status: 200,
    jsonBody: {
      message: '✅ You are authenticated. Welcome!'
    }
  };
}

app.http('authTest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authTest
});
