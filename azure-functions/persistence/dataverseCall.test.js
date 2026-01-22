import { dataverseCall } from './dataverseCall.js';
import { getDataverseAccessToken } from './getDataverseAccessToken.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { createFetchResponse } from '../tests/mocks/mockFetch.js';

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

  it('PATCH: calls fetch with proper args', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValue(
      createFetchResponse({
        json: { success: true },
        headers: { 'content-type': 'application/json' },
      }),
    );

    const body = { name: 'Updated Asset' };

    const result = await dataverseCall({
      query: 'assets(asset123)',
      method: 'PATCH',
      body,
    });

    expect(result).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith(
      'https://fake.dataverse.url/api/data/v9.2/assets(asset123)',
      expect.objectContaining({
        method: 'PATCH',
        headers: expect.objectContaining({
          Authorization: 'Bearer mocked-token',
          'Content-Type': 'application/json',
          'If-Match': '*',
        }),
      }),
    );
  });

  it('GET: properly returns JSON', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValue(
      createFetchResponse({
        json: { data: 'test' },
        headers: { 'content-type': 'application/json' },
      }),
    );

    const result = await dataverseCall({
      query: 'assets',
      method: 'GET',
    });

    expect(result).toEqual({ data: 'test' });
  });

  it('throws on non-OK response', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValue(
      createFetchResponse({
        ok: false,
        status: 400,
        json: {
          error: 'Bad Request',
        },
        message:
          "A binary operator with incompatible types was detected. Found operand types 'Edm.Guid' and 'Edm.String' for operator kind 'Equal'.",
      }),
    );

    await expect(
      dataverseCall({ query: 'foo', method: 'GET' }),
    ).rejects.toThrow('Dataverse call failed with status 400');
  });

  it('throws on fetch rejection', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockRejectedValue(new Error('Network failure'));

    await expect(
      dataverseCall({ query: 'foo', method: 'GET' }),
    ).rejects.toThrow('Network failure');
  });

  it('throws when token retrieval fails', async () => {
    getDataverseAccessToken.mockRejectedValue(
      new DataverseTokenError('Token failed'),
    );

    await expect(
      dataverseCall({ query: 'foo', method: 'GET' }),
    ).rejects.toThrow(DataverseTokenError);
  });

  it('throws when DATAVERSE_URL is missing', async () => {
    process.env.DATAVERSE_URL = '';

    await expect(
      dataverseCall({ query: 'foo', method: 'GET' }),
    ).rejects.toThrow('DATAVERSE_URL is missing');
  });

  // New tests for responseMode
  it('responseMode="id" extracts ID from OData-EntityId header', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValue(
      createFetchResponse({
        status: 204,
        headers: {
          'OData-EntityId':
            'https://fake.dataverse.url/api/data/v9.2/table(id-guid-123)',
        },
      }),
    );

    const result = await dataverseCall({
      query: 'table',
      method: 'POST',
      body: {},
      responseMode: 'id',
    });

    expect(result).toEqual({ id: 'id-guid-123' });
  });

  it('responseMode="headers" returns id + all headers', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValue(
      createFetchResponse({
        status: 204,
        headers: {
          'OData-EntityId':
            'https://fake.dataverse.url/api/data/v9.2/table(id-guid-456)',
          'x-ms-some-header': 'test-value',
        },
      }),
    );

    const result = await dataverseCall({
      query: 'table',
      method: 'POST',
      body: {},
      responseMode: 'headers',
    });

    expect(result).toEqual({
      id: 'id-guid-456',
      headers: {
        'OData-EntityId':
          'https://fake.dataverse.url/api/data/v9.2/table(id-guid-456)',
        'x-ms-some-header': 'test-value',
      },
    });
  });

  it('responseMode default returns null for 204', async () => {
    getDataverseAccessToken.mockResolvedValue('mocked-token');

    global.fetch.mockResolvedValue(
      createFetchResponse({
        status: 204,
      }),
    );

    const result = await dataverseCall({
      query: 'table',
      method: 'POST',
      body: {},
    });

    expect(result).toBeNull();
  });
});
