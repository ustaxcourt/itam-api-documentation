import { decommissionAssetHandler } from './decommissionAsset.js';
import { decommissionWrapper } from '../useCases/decommissionWrapper.js';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('../useCases/decommissionWrapper.js');
jest.mock('./buildResponse.js', () => ({
  buildResponse: jest.fn((status, message, data = null) => ({
    status,
    jsonBody: {
      message,
      data,
    },
  })),
}));

describe('decommissionAssetHandler', () => {
  let context;

  beforeEach(() => {
    context = {
      error: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('successfully decommissions asset on PATCH', async () => {
    decommissionWrapper.mockResolvedValue();

    const request = {
      method: 'PATCH',
      params: {
        itemid: 'asset123',
      },
    };

    const result = await decommissionAssetHandler(request, context);

    expect(decommissionWrapper).toHaveBeenCalledWith('asset123');
    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully decommissioned asset',
      'asset123',
    );

    expect(result).toEqual({
      status: 200,
      jsonBody: {
        message: 'Successfully decommissioned asset',
        data: 'asset123',
      },
    });

    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 400 when asset ID is missing', async () => {
    // Bad Request
    const request = {
      method: 'PATCH',
      params: {},
    };

    const result = await decommissionAssetHandler(request, context);

    expect(decommissionWrapper).not.toHaveBeenCalled();
    expect(buildResponse).toHaveBeenCalledWith(400, 'Missing Asset ID');

    expect(result).toEqual({
      status: 400,
      jsonBody: {
        message: 'Missing Asset ID',
        data: null,
      },
    });
  });

  it('returns 400 for invalid HTTP/REST method', async () => {
    // Bad Request
    const request = {
      method: 'GET',
      params: {
        itemid: 'asset123',
      },
    };

    const result = await decommissionAssetHandler(request, context);

    expect(decommissionWrapper).not.toHaveBeenCalled();
    expect(context.error).not.toHaveBeenCalled(); // Bad Request handled explicitly
    expect(buildResponse).toHaveBeenCalledWith(400, 'Invalid REST Method');

    expect(result).toEqual({
      status: 400,
      jsonBody: {
        message: 'Invalid REST Method',
        data: null,
      },
    });
  });

  it('returns 404 when decommissionWrapper throws NotFoundError', async () => {
    decommissionWrapper.mockRejectedValue(
      new NotFoundError('This asset has been decommissioned.'),
    );

    const request = {
      method: 'PATCH',
      params: {
        itemid: 'asset123',
      },
    };

    const result = await decommissionAssetHandler(request, context);

    expect(decommissionWrapper).toHaveBeenCalledWith('asset123');

    expect(buildResponse).toHaveBeenCalledWith(
      404,
      'This asset has been decommissioned.',
    );

    expect(result).toEqual({
      status: 404,
      jsonBody: {
        message: 'This asset has been decommissioned.',
        data: null,
      },
    });

    expect(context.error).not.toHaveBeenCalled();
  });

  it('logs error and returns internal error response for unexpected errors', async () => {
    const error = new Error('Dataverse failure');
    error.statusCode = 500;

    decommissionWrapper.mockRejectedValue(error);

    const request = {
      method: 'PATCH',
      params: {
        itemid: 'asset123',
      },
    };

    const result = await decommissionAssetHandler(request, context);

    expect(decommissionWrapper).toHaveBeenCalledWith('asset123');

    expect(context.error).toHaveBeenCalledWith(
      'Unable to decommission the asset',
      'Dataverse failure',
    );

    expect(buildResponse).toHaveBeenCalledWith(500, 'Dataverse failure');

    expect(result).toEqual({
      status: 500,
      jsonBody: {
        message: 'Dataverse failure',
        data: null,
      },
    });
  });
});
