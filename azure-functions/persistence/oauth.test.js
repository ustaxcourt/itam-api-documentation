import { getToken } from './oauth.js';

describe('getToken', () => {
  let clientIDStorage;
  let tenantIDStorage;
  let dataverseStorage;
  let scopeStorage;

  beforeAll(() => {
    clientIDStorage = process.env.CLIENT_ID;
    tenantIDStorage = process.env.TENANT_ID;
    dataverseStorage = process.env.DATAVERSE_INTERNAL;
    scopeStorage = process.env.SCOPE;

    process.env.CLIENT_ID = 'test-client-id';
    process.env.TENANT_ID = 'test-tenant-id';
    process.env.DATAVERSE_INTERNAL = 'test-secret';
    process.env.SCOPE = 'https://example.com/.default';
  });

  afterAll(() => {
    process.env.CLIENT_ID = clientIDStorage;
    process.env.TENANT_ID = tenantIDStorage;
    process.env.DATAVERSE_INTERNAL = dataverseStorage;
    process.env.SCOPE = scopeStorage;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return access token when API call succeeds', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ access_token: 'mocked-access-token' }),
    });

    const token = await getToken();

    expect(token).toBe('mocked-access-token');
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://login.microsoftonline.com'),
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }),
    );
  });

  it('should throw an error when API call fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      text: async () => 'Client authentication failed.',
    });

    await expect(getToken()).rejects.toThrow('Client authentication failed.');
    expect(global.fetch).toHaveBeenCalledTimes(1);
  });
});
