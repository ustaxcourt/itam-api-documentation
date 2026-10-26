import { assetSearchHandler } from './assetSearch.js';
import { buildResponse } from './buildResponse.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { assetSearchManager } from '../useCases/assetSearchManager.js';

jest.mock('../useCases/assetSearchManager.js');

describe('assetSearchHandler', () => {
  let context;

  beforeEach(() => {
    context = {
      log: jest.fn(),
      error: jest.fn(),
    };
    jest.clearAllMocks();
  });

  function createRequest(queryParams = {}) {
    return {
      query: new Map(Object.entries(queryParams)),
    };
  }

  it('returns 200 and assets on successful search', async () => {
    const queryParams = { serialNumber: '123456' };

    const assets = {
      total: 1,
      data: [{ id: 'asset-1' }],
    };

    assetSearchManager.mockResolvedValue(assets);

    const request = createRequest(queryParams);
    const result = await assetSearchHandler(request, context);

    expect(assetSearchManager).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual(buildResponse(200, 'Success', assets));
    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 200 and assets for combined query parameters', async () => {
    const queryParams = {
      serialNumber: 'ABC123',
      location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    };

    const assets = {
      total: 2,
      data: [{ id: 'asset-1' }, { id: 'asset-2' }],
    };

    assetSearchManager.mockResolvedValue(assets);

    const request = createRequest(queryParams);
    const result = await assetSearchHandler(request, context);

    expect(assetSearchManager).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual(buildResponse(200, 'Success', assets));
    expect(context.error).not.toHaveBeenCalled();
  });

  it('delegates search parameters to the use case and assets that are not decommissioned', async () => {
    const queryParams = {
      location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      serialNumber: 'ABC123',
      isUnassigned: 'true',
    };

    // Data returned will never include items that are decommissioned (true status) - this filter is applied in the persistence layer
    const useCaseResult = {
      total: 2,
      data: [
        { id: 'asset-1', status: 'Available', decommissioned: false },
        { id: 'asset-2', status: 'Available', decommissioned: null },
      ],
    };

    assetSearchManager.mockResolvedValue(useCaseResult);

    const request = createRequest(queryParams);
    const result = await assetSearchHandler(request, context);

    expect(assetSearchManager).toHaveBeenCalledWith(queryParams);

    // Handler returns use case result in response body
    expect(result).toEqual(buildResponse(200, 'Success', useCaseResult));

    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 400 when use case throws BadRequest', async () => {
    const queryParams = {};
    const error = new BadRequest(
      'At least one valid search filter must be provided',
    );

    assetSearchManager.mockRejectedValue(error);

    const request = createRequest(queryParams);
    const result = await assetSearchHandler(request, context);

    expect(assetSearchManager).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual(buildResponse(400, error.message));
    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 404 when use case throws NotFoundError', async () => {
    const queryParams = { location: 'invalid-location' };
    const error = new NotFoundError('Location not found');

    assetSearchManager.mockRejectedValue(error);

    const request = createRequest(queryParams);
    const result = await assetSearchHandler(request, context);

    expect(assetSearchManager).toHaveBeenCalledWith(queryParams);
    expect(result).toEqual(buildResponse(404, error.message));
    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 500 and logs error for unexpected failures', async () => {
    const queryParams = { serialNumber: '123456' };
    const error = new Error('Dataverse failure');

    assetSearchManager.mockRejectedValue(error);

    const request = createRequest(queryParams);
    const result = await assetSearchHandler(request, context);

    expect(assetSearchManager).toHaveBeenCalledWith(queryParams);
    expect(context.error).toHaveBeenCalledWith(
      'Unable to complete search request.',
      error.message,
    );

    expect(result).toEqual(buildResponse(500, error.message));
  });
});
