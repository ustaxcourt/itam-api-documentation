import { assignmentsHandler } from './assetAssignments.js';
import { buildResponse } from './buildResponse.js';
import { assignAssetToUser } from '../useCases/assignAssetToUser.js';
import { unassignAsset } from '../useCases/unassignAsset.js';

jest.mock('./buildResponse.js');
jest.mock('../useCases/assignAssetToUser.js');
jest.mock('../useCases/unassignAsset.js');

describe('assignmentsHandler', () => {
  const context = { error: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should handle POST request successfully', async () => {
    assignAssetToUser.mockResolvedValue();
    buildResponse.mockReturnValue({ status: 200, message: 'OK' });

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', userid: 'user456' },
    };

    const result = await assignmentsHandler(request, context);

    expect(assignAssetToUser).toHaveBeenCalledWith('user456', 'asset123');
    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully updated item assignment',
      'asset123',
    );
    expect(result).toEqual({ status: 200, message: 'OK' });
  });

  it('should handle DELETE request successfully', async () => {
    unassignAsset.mockResolvedValue();
    buildResponse.mockReturnValue({ status: 200, message: 'OK' });

    const request = {
      method: 'DELETE',
      params: { assetid: 'asset123' },
    };

    const result = await assignmentsHandler(request, context);

    expect(unassignAsset).toHaveBeenCalledWith('asset123');
    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully updated item assignment',
      'asset123',
    );
    expect(result).toEqual({ status: 200, message: 'OK' });
  });

  it('should return error for invalid method', async () => {
    buildResponse.mockReturnValue({ status: 500, message: 'Error' });

    const request = {
      method: 'GET',
      params: { assetid: 'asset123' },
    };

    const result = await assignmentsHandler(request, context);

    expect(context.error).toHaveBeenCalled();
    expect(buildResponse).toHaveBeenCalledWith(
      404,
      'Unable to update assignment',
    );
    expect(result).toEqual({ status: 404, message: 'Error' });
  });

  it('should handle 401 error gracefully', async () => {
    const error = { response: { status: 401 } };
    assignAssetToUser.mockRejectedValue(error);
    buildResponse.mockReturnValue({ status: 403, message: 'Unauthorized' });

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', userid: 'user456' },
    };

    const result = await assignmentsHandler(request, context);

    expect(context.error).toHaveBeenCalled();
    expect(buildResponse).toHaveBeenCalledWith(403, 'Unauthorized');
    expect(result).toEqual({ status: 403, message: 'Unauthorized' });
  });
});
