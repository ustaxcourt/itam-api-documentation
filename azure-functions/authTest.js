import { app } from '@azure/functions';
import fetch from 'node-fetch';

export async function authTest(req, context) {
  const baseUrl = process.env.WEBSITE_HOSTNAME
    ? `https://${process.env.WEBSITE_HOSTNAME}`
    : req.url.split('/')[0];

  try {
    const response = await fetch(`${baseUrl}/.auth/me`, {
      headers: {
        Cookie: req.headers['cookie'] // Pass user session cookie to preserve auth
      }
    });

    const data = await response.json();

    if (!data || !data[0]?.access_token) {
      return {
        status: 401,
        jsonBody: {
          error: 'Access token not found in /.auth/me response.'
        }
      };
    }

    return {
      status: 200,
      jsonBody: {
        accessToken: data[0].access_token,
        user: data[0].user_id,
        claims: data[0].user_claims
      }
    };
  } catch (err) {
    context.log.error('Error fetching /.auth/me:', err);
    return {
      status: 500,
      jsonBody: {
        error: 'Failed to retrieve token from /.auth/me',
        details: err.message
      }
    };
  }
}

app.http('authTest', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: authTest
});
