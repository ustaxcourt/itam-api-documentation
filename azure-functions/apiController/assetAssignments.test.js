import { assignmentsHandler } from './assetAssignments';
import { assignAssetToUser } from '../useCases/assignAssetToUser';
import { unassignAsset } from '../useCases/unassignAsset';

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
    };

    const result = await assignmentsHandler(request, context);

    expect(assignAssetToUser).toHaveBeenCalledWith('user456', 'asset123');
    expect(result).toEqual({
      status: 200,
      jsonBody: {
        data: null,
        message: 'Successfully updated item assignment for asset123',
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
        data: null,
        message: 'Successfully updated item assignment for asset123',
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
    const error = new Error('Unauthorized');
    assignAssetToUser.mockRejectedValue(error);

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', userid: 'user456' },
    };

    const result = await assignmentsHandler(request, context);

    expect(context.error).toHaveBeenCalled();
    expect(result).toEqual({
      status: 401,
      jsonBody: {
        data: null,
        message: 'Unauthorized',
      },
    });
  });
});
