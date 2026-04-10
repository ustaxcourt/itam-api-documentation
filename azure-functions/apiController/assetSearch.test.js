import { assetSearchHandler } from './assetSearch.js';
import { buildResponse } from './buildResponse.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { assetSearchManager } from '../useCases/assetSearchManager.js';
import { validateSearchCriteria } from '../useCases/validateSearchCriteria.js';

jest.mock('../useCases/assetSearchManager.js');
jest.mock('../useCases/validateSearchCriteria.js');

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

  it('should return 200 and assets on successful search', async () => {
    const queryParams = { serialNumber: '123456' };
    const criteria = { filters: { serialNumber: '123456' } };
    const assets = { total: 1, data: [{ id: 'asset1' }] };

    validateSearchCriteria.mockReturnValue(criteria);
    assetSearchManager.mockResolvedValue(assets);

    const request = createRequest(queryParams);

    const result = await assetSearchHandler(request, context);

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryParams);
    expect(assetSearchManager).toHaveBeenCalledWith(criteria);

    expect(result).toEqual(buildResponse(200, 'Success', assets));
    expect(context.error).not.toHaveBeenCalled();
  });

  it('should return 200 and assets for combined search criteria', async () => {
    const queryParams = {
      serialNumber: 'ABC123',
      location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    };

    const criteria = {
      filters: {
        serialNumber: 'ABC123',
        location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        unassigned: false,
      },
      sort: {
        field: 'crf7f_name',
        direction: 'asc',
      },
      limit: 2000,
    };

    const assets = {
      total: 2,
      data: [
        { id: 'asset-1', serialNumber: 'ABC123' },
        { id: 'asset-2', serialNumber: 'ABC123' },
      ],
    };

    validateSearchCriteria.mockReturnValue(criteria);
    assetSearchManager.mockResolvedValue(assets);

    const request = {
      query: new Map(Object.entries(queryParams)),
    };

    const result = await assetSearchHandler(request, context);

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryParams);
    expect(assetSearchManager).toHaveBeenCalledWith(criteria);

    expect(result).toEqual(buildResponse(200, 'Success', assets));

    expect(context.error).not.toHaveBeenCalled();
  });

  it('should return 400 when validateSearchCriteria throws BadRequest', async () => {
    const queryParams = {};
    const error = new BadRequest('Invalid search criteria');

    validateSearchCriteria.mockImplementation(() => {
      throw error;
    });

    const request = createRequest(queryParams);

    const result = await assetSearchHandler(request, context);

    expect(assetSearchManager).not.toHaveBeenCalled();
    expect(result).toEqual(buildResponse(400, error.message));
  });

  it('should return 404 when assetSearchManager throws NotFoundError', async () => {
    const queryParams = { location: 'invalid-location' };
    const criteria = { filters: { location: 'invalid-location' } };
    const error = new NotFoundError('Location not found');

    validateSearchCriteria.mockReturnValue(criteria);
    assetSearchManager.mockRejectedValue(error);

    const request = createRequest(queryParams);

    const result = await assetSearchHandler(request, context);

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryParams);
    expect(assetSearchManager).toHaveBeenCalledWith(criteria);
    expect(context.error).not.toHaveBeenCalled();

    expect(result).toEqual(buildResponse(404, error.message));
  });

  it('should return 500 and log error for unexpected errors', async () => {
    const queryParams = { serialNumber: '123456' };
    const criteria = { filters: { serialNumber: '123456' } };
    const error = new Error('Dataverse failure');

    validateSearchCriteria.mockReturnValue(criteria);
    assetSearchManager.mockRejectedValue(error);

    const request = createRequest(queryParams);

    const result = await assetSearchHandler(request, context);

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryParams);
    expect(assetSearchManager).toHaveBeenCalledWith(criteria);
    expect(context.error).toHaveBeenCalledWith(
      'Unable to complete search request.',
      error.message,
    );

    expect(result).toEqual(buildResponse(500, error.message));
  });
});
