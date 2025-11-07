import axios from 'axios';
import { jest } from '@jest/globals';
import { getToken } from './oauth.js';
import { filterDictionary } from './helperFunctions/filterDict.js';

// Import the function file to ensure it registers with `app`
import './queryAsset.js';
import { app } from '@azure/functions';

jest.mock('axios');
jest.mock('./oauth.js');
jest.mock('./helperFunctions/filterDict.js');

describe('queryAsset Azure Function', () => {
  const mockRequest = {
    method: 'GET',
    url: '/v1/assets/12345',
    params: { itemid: '12345' }
  };

  const mockContext = {
    log: jest.fn(),
    error: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DATAVERSE_URL = 'https://example.crm.dynamics.com';
  });

  it('should return 200 and filtered dictionary on success', async () => {
    getToken.mockResolvedValue('mocked_token');
    axios.get.mockResolvedValue({
      data: {
        value: [{ id: '12345', name: 'Test Asset' }]
      }
    });
    filterDictionary.mockReturnValue({ id: '12345', name: 'Test Asset' });

    // Manually invoke the registered function
    const func = app._httpFunctions.get('queryAsset');
    const response = await func(mockRequest, mockContext);

    expect(response.status).toBe(200);
    expect(response.jsonBody).toEqual({ id: '12345', name: 'Test Asset' });
    expect(getToken).toHaveBeenCalled();
    expect(axios.get).toHaveBeenCalled();
    expect(filterDictionary).toHaveBeenCalled();
  });
});
