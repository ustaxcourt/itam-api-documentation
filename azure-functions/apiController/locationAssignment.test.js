// locationAssignmentsHandler.test.js
import { locationAssignmentsHandler } from './locationAssignment.js';
import { assignLocationToAsset } from '../useCases/assignLocationToAsset.js';
import { buildResponse } from './buildResponse.js';
import { AppError } from '../errors/error.js';

jest.mock('../useCases/assignLocationToAsset.js');
jest.mock('./buildResponse.js');

describe('locationAssignmentsHandler', () => {
  let request;
  let context;

  beforeEach(() => {
    request = {
      params: { assetid: 'asset123', locationid: 'locationABC' },
      method: 'POST',
    };
    context = {
      error: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should return success response for POST method', async () => {
    assignLocationToAsset.mockResolvedValue();
    buildResponse.mockReturnValue({ status: 200, message: 'OK' });

    const result = await locationAssignmentsHandler(request, context);

    expect(assignLocationToAsset).toHaveBeenCalledWith(
      'asset123',
      'locationABC',
    );
    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully assigned location',
      'asset123',
    );
    expect(result).toEqual({ status: 200, message: 'OK' });
    expect(context.error).not.toHaveBeenCalled();
  });

  it('should throw AppError for invalid method', async () => {
    request.method = 'GET';
    buildResponse.mockReturnValue({
      status: 400,
      message: 'Invalid REST Method',
    });

    const result = await locationAssignmentsHandler(request, context);

    expect(assignLocationToAsset).not.toHaveBeenCalled();
    expect(buildResponse).toHaveBeenCalledWith(400, 'Invalid REST Method');
    expect(context.error).toHaveBeenCalledWith(
      'Unable to update assignments',
      'Invalid REST Method',
    );
    expect(result).toEqual({ status: 400, message: 'Invalid REST Method' });
  });

  it('should handle errors from assignLocationToAsset', async () => {
    const error = new AppError(500, 'Internal Server Error');
    assignLocationToAsset.mockRejectedValue(error);
    buildResponse.mockReturnValue({
      status: 500,
      message: 'Internal Server Error',
    });

    const result = await locationAssignmentsHandler(request, context);

    expect(context.error).toHaveBeenCalledWith(
      'Unable to update assignments',
      'Internal Server Error',
    );
    expect(buildResponse).toHaveBeenCalledWith(500, 'Internal Server Error');
    expect(result).toEqual({ status: 500, message: 'Internal Server Error' });
  });
});
