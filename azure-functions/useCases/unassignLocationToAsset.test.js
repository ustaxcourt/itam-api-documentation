import { locationAssignmentsHandler } from '../apiController/locationAssignment.js';
import { unassignLocationToAsset } from '../useCases/unassignLocationToAsset.js';
import { buildResponse } from '../apiController/buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('../useCases/unassignLocationToAsset.js');
jest.mock('../apiController/buildResponse.js');

describe('locationAssignmentsHandler', () => {
  let context;

  beforeEach(() => {
    context = { error: jest.fn() };
    jest.clearAllMocks();
  });

  it('should return success when location is assigned', async () => {
    unassignLocationToAsset.mockResolvedValue();
    buildResponse.mockReturnValueOnce({ status: 200, body: 'mocked response' });

    const request = {
      method: 'DELETE',
      params: { assetid: 'asset123', locationid: 'loc456' },
    };

    const result = await locationAssignmentsHandler(request, context);

    expect(unassignLocationToAsset).toHaveBeenCalledWith('asset123');
    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully unassigned location',
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

    expect(unassignLocationToAsset).not.toHaveBeenCalled();
    expect(context.error).toHaveBeenCalled();
    expect(buildResponse).toHaveBeenCalledWith(400, 'Invalid REST Method');
    expect(result).toEqual({ status: 400, body: 'Invalid REST Method' });
  });

  it('should handle BadRequest when Asset ID is not found', async () => {
    unassignLocationToAsset.mockRejectedValue(
      new NotFoundError(`No location found for ID: asset123`),
    );
    await expect(
      unassignLocationToAsset('asset123', 'invalidLoc'),
    ).rejects.toThrow('No location found for ID: asset123');
  });
});
