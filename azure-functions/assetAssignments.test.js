import { assignmentsHandler } from './assetAssignments.js';
import axios from 'axios';
import { getToken } from './oauth';
import { giveMeRowId } from './helperFunctions/userHelpers';
import { afterAll } from '@jest/globals';

jest.mock('axios');
jest.mock('./oauth');
jest.mock('./helperFunctions/userHelpers');

let dataverseStorage;

describe('assignmentsHandler', () => {
  const context = {
    error: jest.fn()
  };

  beforeAll(function () {
    dataverseStorage = process.env.DATAVERSE_URL;
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url';
  });

  afterAll(function () {
    process.env.DATAVERSE_URL = dataverseStorage
  });

  beforeEach(() => {
    jest.clearAllMocks();

  });

  it('should return 403 if token is missing', async () => {
    getToken.mockResolvedValue(null);

    const request = {
      method: 'POST',
      params: { assetid: '123', userid: '456' }
    };

    const response = await assignmentsHandler(request, context);

    expect(response.status).toBe(403);
    expect(response.jsonBody.error).toBe('Unauthorized');
  });

  it('should handle POST request successfully', async () => {
    getToken.mockResolvedValue('fake-token');
    giveMeRowId.mockResolvedValue('row-id');
    axios.patch.mockResolvedValue({});

    const request = {
      method: 'POST',
      params: { assetid: '123', userid: '456' }
    };

    const response = await assignmentsHandler(request, context);

    expect(axios.patch).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.jsonBody).toBe('Successfully to updated item assignment');
  });

  it('should handle DELETE request successfully', async () => {
    getToken.mockResolvedValue('fake-token');
    axios.patch.mockResolvedValue({});

    const request = {
      method: 'DELETE',
      params: { assetid: '123' }
    };

    const response = await assignmentsHandler(request, context);

    expect(axios.patch).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.jsonBody).toBe('Successfully to updated item assignment');
  });

  it('should handle errors gracefully', async () => {
    getToken.mockResolvedValue('fake-token');
    axios.patch.mockRejectedValue({
      response: {
        status: 400,
        data: {
          "error": {
            "code": "0x80060888",
            "message": "')' or ',' expected at position 5 in '(b7b9-f011-bbd2-000d3a56dc3a)'."
          }
        }
      }
    });

    const request = {
      method: 'POST',
      params: { assetid: '123', userid: '456' }
    };

    const response = await assignmentsHandler(request, context);

    expect(context.error).toHaveBeenCalled();
    expect(response.status).toBe(404);
    expect(response.jsonBody.error).toBe('Unable to update assignment');
    expect(response.jsonBody.details).toBe('invalid itemId or userId');
  });
});
