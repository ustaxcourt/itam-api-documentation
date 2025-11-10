import { assignmentsHandler } from './assetAssignments.js';
import axios from 'axios';
import { getToken } from './oauth';
import { giveMeRowId } from './helperFunctions/userHelpers';

jest.mock('axios');
jest.mock('./oauth');
jest.mock('./helperFunctions/userHelpers');

describe('assignmentsHandler', () => {
  const context = {
    error: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url';
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
        data: { error: { message: 'Bad Request' } }
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
