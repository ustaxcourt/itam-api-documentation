import { handles } from '../index.js'; // Adjust path as needed
import axios from 'axios';
import { getToken } from '../oauth.js';

jest.mock('axios');
jest.mock('../oauth.js');

describe('Azure Function - queryAsset', () => {
  const mockRequest = {
    headers: {
      get: jest.fn((key) => key === 'x-client-secret' ? 'test-secret' : null)
    },
    query: {
      get: jest.fn((key) => key === 'id' ? '12345' : null)
    }
  };

  const mockContext = {
    error: jest.fn(),
    log: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return filtered data with correct types', async () => {
    getToken.mockResolvedValue('mock-token');

    axios.get.mockResolvedValue({
      data: {
        value: [{
          "_crf7f_ois_asset_dat_itemlookup_value@OData.Community.Display.V1.FormattedValue": "Laptop",
          "_crf7f_fac_asset_ref_locationlookup_value@OData.Community.Display.V1.FormattedValue": "Phoenix Office",
          "crf7f_asset_item_status@OData.Community.Display.V1.FormattedValue": "Active",
          "crf7f_phone_numbers": "555-1234",
          "crf7f_asset_item_condition@OData.Community.Display.V1.FormattedValue": "Good",
          "crf7f_service_activation": true,
          "_crf7f_ois_asset_entra_dat_usercurrentow_value@OData.Community.Display.V1.FormattedValue": "John Doe",
          "crf7f_os_version": "Windows 11"
        }]
      }
    });

    const response = await handles(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(response.jsonBody).toEqual({
      assetName: expect.any(String),
      location: expect.any(String),
      itemStatus: expect.any(String),
      phone: expect.any(String),
      condition: expect.any(String),
      activation: expect.any(Boolean),
      user: expect.any(String),
      osVersion: expect.any(String)
    });
  });
});
