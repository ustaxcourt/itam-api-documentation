import { app } from '@azure/functions';
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
  const originalHandler = options?.handler;
  if (typeof originalHandler === 'function') {
    options.handler = async (req, ctx) => {
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
import './apiController/assetAssignments.js';
import './apiController/queryAsset.js';
import './apiController/authTest.js';
import './apiController/locationAssignment.js';
import './apiController/queryAssetsByEmail.js';
import './apiController/getRequirementsForJobTitleRequestHandler.js';

app.setup({
  enableHttpStream: true,
});
