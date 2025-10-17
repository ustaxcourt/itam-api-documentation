// callback.js
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
const codeVerifier = sessionStorage.getItem('pkce_code_verifier');

if (code && codeVerifier) {
  fetch('http://localhost:7071/api/authCallback', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, code_verifier: codeVerifier })
  })
    .then(res => res.json())
    .then(data => {
      console.log('Token exchange result:', data);
      // Store tokens or redirect as needed
    })
    .catch(err => {
      console.error('Token exchange failed:', err);
    });
} else {
  console.error('Missing code or code_verifier');
}
