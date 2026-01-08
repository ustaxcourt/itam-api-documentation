import { assignmentsHandler } from './assetAssignments.js';
import { assignAssetToUser } from '../useCases/assignAssetToUser.js';
import { unassignAsset } from '../useCases/unassignAsset.js';

jest.mock('../useCases/assignAssetToUser.js');
jest.mock('../useCases/unassignAsset.js');

describe('assignmentsHandler', () => {
  const context = { error: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle POST request successfully', async () => {
    assignAssetToUser.mockResolvedValue();

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', userid: 'user456' },
      body: { testbody: 'test' },
    };

    const result = await assignmentsHandler(request, context);

    expect(assignAssetToUser).toHaveBeenCalledWith('user456', 'asset123', {
      testbody: 'test',
    });
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
    };

    const result = await assignmentsHandler(request, context);

    expect(unassignAsset).toHaveBeenCalledWith('asset123');
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
    const error = { response: { status: 401 } };
    assignAssetToUser.mockRejectedValue(error);

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', userid: 'user456' },
      body: {
        zenDeskTicketId: '123123',
        notes: 'this is a very big note',
      },
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
