import { getToken } from './oauth.js';
import axios from 'axios';

jest.mock('axios');

let clientIDStorage;
let tenantIDStorage;
let dataverseStorage;
let scopeStorage;

describe('getToken', () => {

  beforeAll(function () {
    clientIDStorage = process.env.CLIENT_ID;
    tenantIDStorage = process.env.TENANT_ID;
    dataverseStorage = process.env.DATAVERSE_INTERNAL;
    scopeStorage = process.env.SCOPE;
    process.env.CLIENT_ID = 'test-client-id';
    process.env.TENANT_ID = 'test-tenant-id';
    process.env.DATAVERSE_INTERNAL = 'test-secret';
    process.env.SCOPE = 'https://example.com/.default';
  });

  afterAll(function () {
    process.env.CLIENT_ID = clientIDStorage
    process.env.TENANT_ID = tenantIDStorage
    process.env.DATAVERSE_INTERNAL = dataverseStorage
    process.env.SCOPE = scopeStorage
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return access token when API call succeeds', async () => {
    axios.post.mockResolvedValue({
      data: {
        access_token: 'mocked-access-token'
      }
    });

    const token = await getToken();

    expect(token).toBe('mocked-access-token');
    expect(axios.post).toHaveBeenCalled();
  });

  it('should throw an error when API call fails', async () => {
    const errorResponse = {
      response: {
        data: {
          error: 'invalid_client',
          error_description: 'Client authentication failed.'
        }
      }
    };

    axios.post.mockRejectedValue(errorResponse);

    await expect(getToken()).rejects.toEqual(errorResponse);
  });
});
