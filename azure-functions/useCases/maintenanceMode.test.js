const { patchAppHttp } = require('./maintenanceMode.js');

describe('patchAppHttp', () => {
  let app;
  let originalHttpMock;

  const makeReq = () => ({ method: 'GET', url: '/test' });
  const makeCtx = () => ({ log: { warn: jest.fn(), info: jest.fn() } });

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    delete process.env.GLOBAL_MAINTENANCE;

    originalHttpMock = jest.fn();
    app = {
      http: originalHttpMock,
    };
  });

  afterEach(() => {
    delete process.env.GLOBAL_MAINTENANCE;
  });

  test('overrides app.http and returns an unpatched function', () => {
    const unpatch = patchAppHttp(app);

    expect(typeof unpatch).toBe('function');
    expect(app.http).not.toBe(originalHttpMock); // Patched
    unpatch();
    expect(app.http).toBe(originalHttpMock); // Restored
  });

  test('forwards name and options to original http (no handler) to indicate process does not mess with proper routing / registration when no handler is present', () => {
    patchAppHttp(app);

    const options = { methods: ['GET'], authLevel: 'anonymous', route: '/x' };
    app.http('endpoint', options);

    expect(originalHttpMock).toHaveBeenCalledTimes(1);
    expect(originalHttpMock).toHaveBeenCalledWith('endpoint', options);
  });

  test('wraps provided handler with maintenance check', async () => {
    patchAppHttp(app);

    const handler = jest.fn().mockResolvedValue({ status: 200, body: 'ok' });
    const options = { handler };
    app.http('endpoint', options);

    // The registration itself calls into originalHttpMock
    expect(originalHttpMock).toHaveBeenCalledTimes(1);
    const [, registeredOptions] = originalHttpMock.mock.calls[0];

    expect(typeof registeredOptions.handler).toBe('function');
    expect(registeredOptions.handler).not.toBe(handler); // Wrapped
  });

  test('when GLOBAL_MAINTENANCE is off (default), calls the original handler', async () => {
    patchAppHttp(app);

    const handler = jest
      .fn()
      .mockResolvedValue({ status: 200, jsonBody: { ok: true } });
    const options = { handler };
    app.http('ep', options);

    const [, registeredOptions] = originalHttpMock.mock.calls[0];
    const req = makeReq();
    const ctx = makeCtx();
    const res = await registeredOptions.handler(req, ctx);

    expect(handler).toHaveBeenCalledWith(req, ctx);
    expect(res).toEqual({ status: 200, jsonBody: { ok: true } });
    expect(ctx.log.warn).not.toHaveBeenCalled();
  });

  test.each([['true'], ['TRUE'], ['True'], ['1'], ['yes'], ['YeS']])(
    'when GLOBAL_MAINTENANCE is turned on, returns 503 and logs warn',
    async flag => {
      process.env.GLOBAL_MAINTENANCE = flag;

      patchAppHttp(app);

      const handler = jest.fn().mockResolvedValue({ status: 200 });
      const options = { handler };
      app.http('endpointMaint', options);

      const [, registeredOptions] = originalHttpMock.mock.calls[0];
      const ctx = makeCtx();
      const res = await registeredOptions.handler(makeReq(), ctx);

      expect(handler).not.toHaveBeenCalled(); // Blocked by maintenance mode
      expect(res.status).toBe(503);
      expect(res.headers['Content-Type']).toBe('application/json');
      expect(res.headers['Retry-After']).toBe('120');
      expect(res.jsonBody).toEqual({
        error: 'Service temporarily unavailable. Please try again later.',
      });
      expect(ctx.log.warn).toHaveBeenCalledWith(
        'GLOBAL_MAINTENANCE=true → 503 (endpointMaint)',
      );
    },
  );

  test('when GLOBAL_MAINTENANCE is an unrecognized value, handler proceeds - maintenance mode is off', async () => {
    process.env.GLOBAL_MAINTENANCE = 'nope'; // Not in true/1/yes flag options

    patchAppHttp(app);

    const handler = jest.fn().mockResolvedValue({ status: 204 });
    const options = { handler };
    app.http('epOther', options);

    const [, registeredOptions] = originalHttpMock.mock.calls[0];
    const res = await registeredOptions.handler(makeReq(), makeCtx());

    expect(handler).toHaveBeenCalled();
    expect(res).toEqual({ status: 204 });
  });

  test('does not break if app / endpoint options are undefined or if the handler is missing', () => {
    patchAppHttp(app);

    // No options
    app.http('endpoint1');
    // Options without handler
    app.http('endpoint2', { methods: ['POST'] });

    expect(originalHttpMock).toHaveBeenCalledTimes(2);
    expect(originalHttpMock).toHaveBeenNthCalledWith(1, 'endpoint1', undefined);
    expect(originalHttpMock).toHaveBeenNthCalledWith(2, 'endpoint2', {
      methods: ['POST'],
    });
  });

  test('unpatch restores original behavior - no wrapper in place', async () => {
    const unpatch = patchAppHttp(app);
    unpatch(); // Restore

    const handler = jest.fn().mockResolvedValue({ status: 201 });
    const options = { handler };
    app.http('endpointUnpatched', options);

    // Because we unpatched, registration calls the original http
    expect(originalHttpMock).toHaveBeenCalledWith('endpointUnpatched', options);
    const [, registeredOptions] = originalHttpMock.mock.calls[0];
    expect(registeredOptions.handler).toBe(handler);
  });
});
