
const { app } = require('@azure/functions');
const { getToken } = require('../../../shared-logic/auth/oauth');

app.http('testAuth', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'auth/test',
    handler: async (request, context) => {
        try {
            const token = await getToken();
            return {
                status: 200,
                body: {
                    message: 'OAuth authentication successful',
                    accessTokenSnippet: token?.access_token?.substring(0, 20) + '...'
                }
            };
        } catch (error) {
            return {
                status: 500,
                body: {
                    message: 'OAuth authentication failed',
                    error: error.message
                }
            };
        }
    }
});
