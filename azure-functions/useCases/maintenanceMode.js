export function patchAppHttp(app) {
  const _httpOriginal = app.http; // original reference for unpatch later

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

  // flag check with override when maintenance flag is raised
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
    // call to original
    return _httpOriginal.apply(app, [name, options]);
  };

  // unpatch to restore the exact original reference
  return () => {
    app.http = _httpOriginal;
  };
}
