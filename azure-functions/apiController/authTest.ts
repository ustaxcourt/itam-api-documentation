import { app } from '@azure/functions';
import { ApiResponse, buildResponse } from './buildResponse.js';

export async function authTest(): Promise<ApiResponse<null>> {
  return buildResponse(200, '✅ You are authenticated. Welcome!', null);
}

app.http('authTest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authTest,
});
