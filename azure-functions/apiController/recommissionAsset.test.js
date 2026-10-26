import { recommissionAssetHandler } from './recommissionAsset.js';
import { recommissionWrapper } from '../useCases/recommissionWrapper.js';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('../useCases/recommissionWrapper.js');
jest.mock('./buildResponse.js', () => ({
  buildResponse: jest.fn((status, message, data = null) => ({
    status,
    jsonBody: {
      message,
      data,
    },
  })),
}));

describe('recommissionAssetHandler', () => {
  let context;

  beforeEach(() => {
    context = {
      error: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('successfully recommissions an asset on PATCH', async () => {
    recommissionWrapper.mockResolvedValue();

    const request = {
      method: 'PATCH',
      params: {
        itemid: 'asset123',
      },
    };

    const result = await recommissionAssetHandler(request, context);

    expect(recommissionWrapper).toHaveBeenCalledWith('asset123');
    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully recommissioned asset',
      'asset123',
    );

    expect(result).toEqual({
      status: 200,
      jsonBody: {
        message: 'Successfully recommissioned asset',
        data: 'asset123',
      },
    });

    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 400 when asset ID is missing', async () => {
    const request = {
      method: 'PATCH',
      params: {},
    };

    const result = await recommissionAssetHandler(request, context);

    expect(recommissionWrapper).not.toHaveBeenCalled();
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
    const request = {
      method: 'GET',
      params: {
        itemid: 'asset123',
      },
    };

    const result = await recommissionAssetHandler(request, context);

    expect(recommissionWrapper).not.toHaveBeenCalled();
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

  it('returns 404 when recommissionWrapper throws NotFoundError', async () => {
    recommissionWrapper.mockRejectedValue(new NotFoundError('Asset not found'));

    const request = {
      method: 'PATCH',
      params: {
        itemid: 'asset123',
      },
    };

    const result = await recommissionAssetHandler(request, context);

    expect(recommissionWrapper).toHaveBeenCalledWith('asset123');

    expect(buildResponse).toHaveBeenCalledWith(404, 'Asset not found');

    expect(result).toEqual({
      status: 404,
      jsonBody: {
        message: 'Asset not found',
        data: null,
      },
    });

    expect(context.error).not.toHaveBeenCalled();
  });

  it('logs error and returns internal error response for unexpected errors', async () => {
    const error = new Error('Dataverse failure');
    error.statusCode = 500;

    recommissionWrapper.mockRejectedValue(error);

    const request = {
      method: 'PATCH',
      params: {
        itemid: 'asset123',
      },
    };

    const result = await recommissionAssetHandler(request, context);

    expect(recommissionWrapper).toHaveBeenCalledWith('asset123');

    expect(context.error).toHaveBeenCalledWith(
      'Unable to recommission the asset',
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
