import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { getDataverseAccessToken } from './getDataverseAccessToken.js';

let clientIDStorage;
let tenantIDStorage;
let dataverseStorage;
let scopeStorage;

describe('getDataverseAccessToken', () => {
  beforeAll(() => {
    clientIDStorage = process.env.DATAVERSE_CLIENT_ID;
    tenantIDStorage = process.env.TENANT_ID;
    dataverseStorage = process.env.DATAVERSE_INTERNAL;
    scopeStorage = process.env.SCOPE;
    process.env.CLIENT_ID = 'test-client-id';
    process.env.TENANT_ID = 'test-tenant-id';
    process.env.DATAVERSE_INTERNAL = 'test-secret';
    process.env.SCOPE = 'https://example.com/.default';
  });

  afterAll(() => {
    process.env.DATAVERSE_CLIENT_ID = clientIDStorage;
    process.env.TENANT_ID = tenantIDStorage;
    process.env.DATAVERSE_INTERNAL = dataverseStorage;
    process.env.SCOPE = scopeStorage;
  });

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  it('should return access token when API call succeeds', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ access_token: 'mocked-access-token' }),
    });

    const token = await getDataverseAccessToken();

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

  it('should throw an error when API call fails (non-OK response)', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        error: 'invalid_client',
        error_description: 'Client authentication failed.',
      }),
    });

    await expect(getDataverseAccessToken()).rejects.toEqual(
      new DataverseTokenError(
        'Error attempting to retrieve token from Identity Provider',
      ),
    );
  });

  it('should throw an error when API does not receive an access token', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        foo: 'bar',
      }),
    });

    await expect(getDataverseAccessToken()).rejects.toEqual(
      new DataverseTokenError(
        'Error attempting to retrieve token from Identity Provider',
      ),
    );
  });

  it('should throw an error when fetch itself rejects', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    await expect(getDataverseAccessToken()).rejects.toEqual(
      new DataverseTokenError(
        'Error attempting to retrieve token from Identity Provider',
      ),
    );
  });
});
