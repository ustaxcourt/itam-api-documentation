const clientId = "<YOUR_CLIENT_ID>";
const tenantId = "<YOUR_TENANT_ID>";
const redirectUri = "http://localhost:7071/api/authCallback"; // Azure Function callback
const scope = "openid profile offline_access https://yourorg.crm.dynamics.com/.default";

function base64URLEncode(str) {
  return btoa(String.fromCharCode(...new Uint8Array(str)))
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generatePKCECodes() {
  const codeVerifier = base64URLEncode(crypto.getRandomValues(new Uint8Array(32)));
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const codeChallenge = base64URLEncode(digest);

  sessionStorage.setItem("pkce_code_verifier", codeVerifier);
  return codeChallenge;
}

document.getElementById("loginBtn").addEventListener("click", async () => {
  const codeChallenge = await generatePKCECodes();

  const authUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize?` +
    `client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_mode=query&scope=${encodeURIComponent(scope)}&code_challenge=${codeChallenge}` +
    `&code_challenge_method=S256`;

  window.location.href = authUrl;
});
