import { locationAssignmentsHandler } from './locationAssignment';
import { assignLocationToAsset } from '../useCases/assignLocationToAsset';
import { NotFoundError } from '../errors/NotFoundError';

jest.mock('../useCases/assignLocationToAsset.js');

describe('locationAssignmentsHandler', () => {
  let context;

  beforeEach(() => {
    context = { error: jest.fn() };
    jest.resetAllMocks();
  });

  it('should assign location and return success response for POST', async () => {
    assignLocationToAsset.mockResolvedValue();

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', locationid: 'loc456' },
    };

    const result = await locationAssignmentsHandler(request, context);

    expect(assignLocationToAsset).toHaveBeenCalledWith('asset123', 'loc456');
    expect(result).toEqual({
      status: 200,
      jsonBody: {
        data: 'asset123',
        message: 'Successfully assigned location',
      },
    });
    expect(context.error).not.toHaveBeenCalled();
  });

  it('should throw BadRequest for non-POST method', async () => {
    const request = {
      method: 'GET',
      params: { assetid: 'asset123', locationid: 'loc456' },
    };

    const result = await locationAssignmentsHandler(request, context);

    expect(assignLocationToAsset).not.toHaveBeenCalled();
    expect(context.error).toHaveBeenCalledWith(
      'Unable to update assignments',
      'Invalid REST Method',
    );
    expect(result).toEqual({
      status: 400,
      jsonBody: {
        data: null,
        message: 'Invalid REST Method',
      },
    });
  });

  it('should handle errors from assignLocationToAsset', async () => {
    const error = new NotFoundError('Location ID not found');
    assignLocationToAsset.mockRejectedValue(error);

    const request = {
      method: 'POST',
      params: { assetid: 'asset123', locationid: 'invalidLoc' },
    };

    const result = await locationAssignmentsHandler(request, context);

    expect(assignLocationToAsset).toHaveBeenCalledWith(
      'asset123',
      'invalidLoc',
    );
    expect(context.error).toHaveBeenCalledWith(
      'Unable to update assignments',
      'Location ID not found',
    );
    expect(result).toEqual({
      status: 404,
      jsonBody: {
        data: null,
        message: 'Location ID not found',
      },
    });
  });
});
