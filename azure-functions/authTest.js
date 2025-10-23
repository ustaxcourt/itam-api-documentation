import { app } from '@azure/functions';

app.http('authTest', {
  methods: ['GET'],
  authLevel: 'function', // Azure handles auth before your code runs
  route: 'authTest',
  handler: async (request, context) => {
    return {
      status: 200,
      body: '✅ You are authenticated!',
    };
  },
});
