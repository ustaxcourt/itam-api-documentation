import { app } from '@azure/functions';

console.log('[process] index.js loaded');
console.log(
  '[process] process.env.GLOBAL_MAINTENANCE =',
  process.env.GLOBAL_MAINTENANCE,
);

// This section here will check for maintenance flag prior to the endpoints booting up
// Ambiguity check and safeguard - if not true or false, it is just false for maintenance mode. 3 cases for true
const isOn = (val, def = false) => {
  if (val === undefined) return def;
  const s = String(val).trim().toLowerCase();
  return s === 'true' || s === '1' || s === 'yes';
};
// Builder for 503 message with retry
const serviceUnavailable = (
  retry = 120,
  msg = 'Service temporarily unavailable. Please try again later.',
) => ({
  status: 503,
  headers: {
    'Content-Type': 'application/json',
    'Retry-After': String(retry),
  },
  jsonBody: { error: msg },
});

// Keep original app.http
const _http = app.http.bind(app);

// Override app.http to auto-wrap every handler - here we are checking for the environment variable flag GLOBAL_MAINTENANCE
app.http = function (name, options) {
  console.log(`[patch] wrapping ${name}`); // wrapping happening at registration time

  const originalHandler = options?.handler;
  if (typeof originalHandler === 'function') {
    options.handler = async (req, ctx) => {
      console.log(
        '[handler] GLOBAL_MAINTENANCE =',
        process.env.GLOBAL_MAINTENANCE,
      );

      if (isOn(process.env.GLOBAL_MAINTENANCE, false)) {
        ctx?.log?.warn?.(`GLOBAL_MAINTENANCE=true → 503 (${name})`);
        return serviceUnavailable(120);
      }
      return originalHandler(req, ctx);
    };
  }
  return _http(name, options);
};

// Back to business now that the check for the flag is complate
// Import your function(s) here
await import('./apiController/assetAssignments.js');
await import('./apiController/queryAsset.js');
await import('./apiController/authTest.js');
await import('./apiController/locationAssignment.js');
await import('./apiController/queryAssetsByEmail.js');
await import('./apiController/getRequirementsForJobTitleRequestHandler.js');

app.setup({
  enableHttpStream: true,
});
