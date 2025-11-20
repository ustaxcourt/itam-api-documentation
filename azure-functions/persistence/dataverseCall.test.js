import { dataverseCall } from './dataverseCall.js';
import { getDataverseAccessToken } from './getDataverseAccessToken.js';

jest.mock('./getDataverseAccessToken.js');

describe('dataverseCall', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
  });

  it('should call fetch with correct URL, method, headers, and body for PATCH', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const url = 'https://fake.dataverse.url/api/data/v9.2/assets(asset123)';
    const body = { name: 'Updated Asset' };

    const result = await dataverseCall(url, 'PATCH', body);

    expect(result).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({
          Authorization: 'Bearer mocked-token',
          'If-Match': '*',
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(body),
      }),
    );
  });

  it('should call fetch with correct headers for GET', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: 'test' }),
    });

    const url = 'https://fake.dataverse.url/api/data/v9.2/assets';
    const result = await dataverseCall(url, 'GET');

    expect(result).toEqual({ data: 'test' });
    expect(global.fetch).toHaveBeenCalledWith(
      url,
      expect.objectContaining({
        method: 'GET',
        headers: expect.objectContaining({
          Authorization: 'Bearer mocked-token',
          Accept: 'application/json',
        }),
      }),
    );
  });

  it('should throw an error when fetch returns non-OK response', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ error: 'Bad Request' }),
    });

    await expect(
      dataverseCall('https://fake.dataverse.url', 'GET'),
    ).rejects.toThrow('Dataverse call failed with status 400');
  });

  it('should throw an error when fetch itself rejects', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    await expect(
      dataverseCall('https://fake.dataverse.url', 'GET'),
    ).rejects.toThrow('Network failure');
  });

  it('should throw an error when no token is returned', async () => {
    getDataverseAccessToken.mockResolvedValue(null);

    await expect(
      dataverseCall('https://fake.dataverse.url', 'GET'),
    ).rejects.toThrow('No token found');
  });
});
