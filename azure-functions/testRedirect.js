import { app } from '@azure/functions';

app.http('testRedirect', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    context.res = {
      status: 302,
      headers: {
        Location: 'https://www.microsoft.com'
      }
    };
    return;
  }
});
