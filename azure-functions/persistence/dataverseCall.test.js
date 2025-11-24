import { dataverseCall } from './dataverseCall.js';
import { getDataverseAccessToken } from './getDataverseAccessToken.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { beforeAll } from '@jest/globals';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('./getDataverseAccessToken.js');
let originalEnv;

describe('dataverseCall', () => {
  beforeAll(() => {
    originalEnv = process.env.DATAVERSE_URL;
  });

  afterAll(() => {
    process.env.DATAVERSE_URL = originalEnv;
  });

  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url/api/data/v9.2';
  });

  it('should call fetch with correct URL, method, headers, and body for PATCH', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const query = 'assets(asset123)';
    const body = { name: 'Updated Asset' };

    const result = await dataverseCall({ query, method: 'PATCH', body });

    expect(result).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.DATAVERSE_URL}/${query}`,
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
    const query = 'assets';
    const result = await dataverseCall({ query, method: 'GET' });

    expect(result).toEqual({ data: 'test' });
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.DATAVERSE_URL}/${query}`,
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
      dataverseCall({ query: 'foo', method: 'GET' }),
    ).rejects.toThrow('Dataverse call failed with status 400');
  });

  it('should throw an error when fetch itself rejects', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockRejectedValueOnce(new Error('Network failure'));

    await expect(
      dataverseCall({ query: 'foo', method: 'GET' }),
    ).rejects.toThrow('Network failure');
  });

  it('should throw DataverseTokenError when token retrieval fails', async () => {
    getDataverseAccessToken.mockRejectedValue(
      new DataverseTokenError(
        'Error attempting to retrieve token from Identity Provider',
      ),
    );

    await expect(
      dataverseCall({ query: 'foo', method: 'GET' }),
    ).rejects.toThrow(DataverseTokenError);
  });

  it('should throw an error when DATAVERSE_URL is empty', async () => {
    process.env.DATAVERSE_URL = '';

    await expect(
      dataverseCall({ query: 'foo', method: 'GET' }),
    ).rejects.toThrow(new InternalServerError('DATAVERSE_URL is missing'));
  });
});
