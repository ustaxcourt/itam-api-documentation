import { assignmentsHandler } from './assetAssignments.js';
import { assignAssetToUser } from '../useCases/assignAssetToUser.js';
import { unassignAsset } from '../useCases/unassignAsset.js';

jest.mock('../useCases/assignAssetToUser.js');
jest.mock('../useCases/unassignAsset.js');

describe('assignmentsHandler', () => {
  const context = { error: jest.fn() };

  const validBody = {
    zendeskTicketId: 123123,
    condition: 'Good',
    notes: 'this is a very big note',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle POST request successfully', async () => {
    assignAssetToUser.mockResolvedValue();

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', userid: 'user456' },
      json: jest.fn().mockResolvedValue(validBody),
    };

    const result = await assignmentsHandler(request, context);

    expect(assignAssetToUser).toHaveBeenCalledWith(
      'user456',
      'asset123',
      validBody,
    );
    expect(result).toEqual({
      status: 200,
      jsonBody: {
        data: 'asset123',
        message: 'Successfully updated item assignment',
      },
    });
  });

  it('should handle DELETE request successfully', async () => {
    unassignAsset.mockResolvedValue();

    const request = {
      method: 'DELETE',
      params: { assetid: 'asset123' },
      json: jest.fn().mockResolvedValue(validBody),
    };

    const result = await assignmentsHandler(request, context);

    expect(unassignAsset).toHaveBeenCalledWith('asset123', validBody);
    expect(result).toEqual({
      status: 200,
      jsonBody: {
        data: 'asset123',
        message: 'Successfully updated item assignment',
      },
    });
  });

  it('should return error for invalid method', async () => {
    const request = {
      method: 'GET',
      params: { assetid: 'asset123' },
      json: jest.fn().mockResolvedValue(validBody),
    };

    const result = await assignmentsHandler(request, context);

    expect(context.error).toHaveBeenCalled();
    expect(result).toEqual({
      status: 400,
      jsonBody: {
        data: null,
        message: 'Invalid REST Method',
      },
    });
  });

  it('should handle 401 error gracefully', async () => {
    assignAssetToUser.mockRejectedValue({ response: { status: 401 } });

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', userid: 'user456' },
      json: jest.fn().mockResolvedValue(validBody),
    };

    const result = await assignmentsHandler(request, context);

    expect(context.error).toHaveBeenCalled();
    expect(result).toEqual({
      status: 403,
      jsonBody: {
        data: null,
        message: 'Unauthorized',
      },
    });
  });
});
