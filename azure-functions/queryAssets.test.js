
const { handles } = require('./queryAsset.js');
const axios = require('axios');
const { getToken } = require('./oauth.js');


jest.mock('axios');
jest.mock('./oauth');

describe('handles function', () => {
  const mockContext = {
    log: jest.fn(),
    error: jest.fn()
  };

  const mockRequest = (headers = {}, query = {}) => ({
    headers: {
      get: (key) => headers[key]
    },
    query: {
      get: (key) => query[key]
    }
  });

  const mockData = {
    value: [{
      "_crf7f_ois_asset_dat_itemlookup_value@OData.Community.Display.V1.FormattedValue": "Asset A",
      "crf7f_phone_numbers": "123-456-7890",
      "crf7f_os_version": "Windows 11"
    }]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DATAVERSE_URL = 'https://example.crm.dynamics.com';
  });

  it('returns 400 if client secret is missing', async () => {
    const response = await handles(mockRequest({}, { id: 'abc' }), mockContext);
    expect(response.status).toBe(400);
    expect(response.jsonBody.error).toBe('Missing client secret');
  });

  it('returns 403 if token is invalid', async () => {
    getToken.mockResolvedValue(null);
    const response = await handles(mockRequest({ 'x-client-secret': 'secret' }, { id: 'abc' }), mockContext);
    expect(response.status).toBe(403);
    expect(response.jsonBody.error).toBe('Unauthorized');
  });

  it('returns 404 if no data is found', async () => {
    getToken.mockResolvedValue('valid-token');
    axios.get.mockResolvedValue({ data: { value: [] } });

    const response = await handles(mockRequest({ 'x-client-secret': 'secret' }, { id: 'abc' }), mockContext);
    expect(response.status).toBe(404);
    expect(response.jsonBody.details).toBe('No matching records found');
  });

  it('returns 200 with filtered data', async () => {
    getToken.mockResolvedValue('valid-token');
    axios.get.mockResolvedValue({ data: mockData });

    const response = await handles(mockRequest({ 'x-client-secret': 'secret' }, { id: 'abc' }), mockContext);
    expect(response.status).toBe(200);
    expect(response.jsonBody).toEqual({
      assetName: 'Asset A',
      phone: '123-456-7890',
      osVersion: 'Windows 11'
    });
  });

  it('returns 500 on axios error', async () => {
    getToken.mockResolvedValue('valid-token');
    axios.get.mockRejectedValue(new Error('Network error'));

    const response = await handles(mockRequest({ 'x-client-secret': 'secret' }, { id: 'abc' }), mockContext);
    expect(response.status).toBe(500);
    expect(response.jsonBody.error).toBe('Dataverse query failed');
  });
});
