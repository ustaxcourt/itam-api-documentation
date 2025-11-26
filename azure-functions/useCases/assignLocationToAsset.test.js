import { locationAssignmentsHandler } from '../apiController/locationAssignment.js';
import { assignLocationToAsset } from '../useCases/assignLocationToAsset.js';
import { buildResponse } from '../apiController/buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('../useCases/assignLocationToAsset.js');
jest.mock('../apiController/buildResponse.js');

describe('locationAssignmentsHandler', () => {
  let context;

  beforeEach(() => {
    context = { error: jest.fn() };
    jest.clearAllMocks();
  });

  it('should return success when location is assigned', async () => {
    assignLocationToAsset.mockResolvedValueOnce();
    buildResponse.mockReturnValueOnce({ status: 200, body: 'mocked response' });

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', locationid: 'loc456' },
    };

    const result = await locationAssignmentsHandler(request, context);

    expect(assignLocationToAsset).toHaveBeenCalledWith('asset123', 'loc456');
    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully assigned location',
      'asset123',
    );
    expect(result).toEqual({ status: 200, body: 'mocked response' });
    expect(context.error).not.toHaveBeenCalled();
  });

  it('should return error for invalid method', async () => {
    buildResponse.mockReturnValueOnce({
      status: 400,
      body: 'Invalid REST Method',
    });

    const request = {
      method: 'GET',
      params: { assetid: 'asset123', locationid: 'loc456' },
    };

    const result = await locationAssignmentsHandler(request, context);

    expect(assignLocationToAsset).not.toHaveBeenCalled();
    expect(context.error).toHaveBeenCalled();
    expect(buildResponse).toHaveBeenCalledWith(400, 'Invalid REST Method');
    expect(result).toEqual({ status: 400, body: 'Invalid REST Method' });
  });

  it('should handle BadRequest when Asset ID is not found', async () => {
    assignLocationToAsset.mockRejectedValue(
      new NotFoundError('Asset ID not found'),
    );
    await expect(
      assignLocationToAsset('asset123', 'invalidLoc'),
    ).rejects.toThrow('Asset ID not found');
  });
});
