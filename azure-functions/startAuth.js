import { app } from '@azure/functions';
import crypto from 'crypto';

const { CLIENT_ID, TENANT_ID, REDIRECT_URI, SCOPE } = process.env;

function generateCodeVerifier() {
  return crypto.randomBytes(32).toString('hex');
}

function generateCodeChallenge(codeVerifier) {
  const hash = crypto.createHash('sha256').update(codeVerifier).digest();
  return hash.toString('base64url'); // base64url encoding
}

app.http('startAuth', {
  methods: ['GET'],
  authLevel: 'anonymous',
  handler: async (request, context) => {
    try {
      if (!CLIENT_ID || !TENANT_ID || !REDIRECT_URI || !SCOPE) {
        context.log.error('Missing environment variables');
        return {
          status: 500,
          body: 'Missing CLIENT_ID, TENANT_ID, REDIRECT_URI, or SCOPE in environment settings.'
        };
      }

      const codeVerifier = generateCodeVerifier();
      const codeChallenge = generateCodeChallenge(codeVerifier);

      const authorizeUrl =
        `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?` +
        `client_id=${CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
        `&response_mode=query` +
        `&scope=${encodeURIComponent(SCOPE)}` +
        `&code_challenge=${codeChallenge}` +
        `&code_challenge_method=S256`;

      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <title>Redirecting...</title>
            <script>
              document.cookie = "code_verifier=${codeVerifier}; path=/; secure; samesite=None";
              setTimeout(() => {
                window.location.href = "${authorizeUrl}";
              }, 500); // Delay to ensure cookie is stored
            </script>
          </head>
          <body>
            <p>Redirecting to sign in...</p>
          </body>
        </html>
      `;

      return {
        status: 200,
        headers: {
          'Content-Type': 'text/html'
        },
        body: html
      };
    } catch (error) {
      context.log.error('startAuth error:', error.message);
      return {
        status: 500,
        body: 'Internal Server Error'
      };
    }
  }
});
