
import { app } from '@azure/functions';

app.http('helloworld', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    const name = request.query.get('name') || 'World';
    return {
      status: 200,
      body: `Hello, ${name}!`
    };
  }
});
