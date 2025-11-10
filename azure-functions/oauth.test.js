import { getToken } from './oauth.js';
import axios from 'axios';

jest.mock('axios');

describe('getToken', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.CLIENT_ID = 'test-client-id';
    process.env.TENANT_ID = 'test-tenant-id';
    process.env.DATAVERSE_INTERNAL = 'test-secret';
    process.env.SCOPE = 'https://example.com/.default';
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
