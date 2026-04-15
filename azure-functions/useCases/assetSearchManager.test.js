import { assetSearchManager } from './assetSearchManager.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { filteredSearch } from '../persistence/filteredSearch.js';
import { filterDictionaryByList } from '../persistence/filterDictbyList.js';
import { getLocationById } from '../persistence/getLocationById.js';
import { validateSearchCriteria } from './helpers/validateSearchCriteria.js';

jest.mock('../persistence/filteredSearch.js');
jest.mock('../persistence/filterDictbyList.js');
jest.mock('../persistence/getLocationById.js');
jest.mock('./helpers/validateSearchCriteria.js');

describe('assetSearchManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a regular combined search result with total and data fields present', async () => {
    const queryObject = {
      serialNumber: '123456',
      location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      unassigned: '',
    };

    const criteria = {
      filters: {
        serialNumber: '123456',
        location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        type: undefined,
        unassigned: true,
      },
      limit: 2000,
    };

    const assets = [{ id: 1 }, { id: 2 }, { id: 3 }];

    validateSearchCriteria.mockReturnValue(criteria);
    getLocationById.mockResolvedValue({ id: criteria.filters.location });
    filteredSearch.mockResolvedValue({ items: assets });
    filterDictionaryByList.mockReturnValue(assets);

    const result = await assetSearchManager(queryObject);

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryObject);
    expect(getLocationById).toHaveBeenCalledWith(criteria.filters.location);
    expect(filteredSearch).toHaveBeenCalledWith(criteria);
    expect(filterDictionaryByList).toHaveBeenCalledWith(assets);

    expect(result).toEqual({
      total: assets.length,
      data: assets,
    });
  });

  it('runs search without location filter and does not validate location', async () => {
    const queryObject = {
      serialNumber: '123456',
    };

    const criteria = {
      filters: {
        serialNumber: '123456',
        location: undefined,
        type: undefined,
        unassigned: false,
      },
      limit: 2000,
    };

    // Simulates a search that returns 2 assets matching the serial number filter, with no location filter applied
    const assets = [{ id: 1 }, { id: 2 }];

    validateSearchCriteria.mockReturnValue(criteria);
    filteredSearch.mockResolvedValue({ items: assets });
    filterDictionaryByList.mockReturnValue(assets);

    const result = await assetSearchManager(queryObject);

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryObject);
    expect(getLocationById).not.toHaveBeenCalled();
    expect(filteredSearch).toHaveBeenCalledWith(criteria);
    expect(filterDictionaryByList).toHaveBeenCalledWith(assets);

    expect(result).toEqual({
      total: assets.length,
      data: assets,
    });
  });

  it('validates location when location filter is provided', async () => {
    const queryObject = {
      location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    };

    const criteria = {
      filters: {
        location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        type: undefined,
        serialNumber: undefined,
        unassigned: false,
      },
      limit: 2000,
    };

    const assets = [{ id: 'asset-1' }];

    validateSearchCriteria.mockReturnValue(criteria);
    getLocationById.mockResolvedValue({ id: criteria.filters.location });
    filteredSearch.mockResolvedValue({ items: assets });
    filterDictionaryByList.mockReturnValue(assets);

    const result = await assetSearchManager(queryObject);

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryObject);
    expect(getLocationById).toHaveBeenCalledWith(criteria.filters.location);
    expect(filteredSearch).toHaveBeenCalledWith(criteria);
    expect(filterDictionaryByList).toHaveBeenCalledWith(assets);

    expect(result).toEqual({
      total: assets.length,
      data: assets,
    });
  });

  it('throws NotFoundError if location does not exist', async () => {
    const queryObject = {
      location: 'invalid-location-id',
    };

    const criteria = {
      filters: {
        location: 'invalid-location-id',
        type: undefined,
        serialNumber: undefined,
        unassigned: false,
      },
      limit: 2000,
    };

    validateSearchCriteria.mockReturnValue(criteria);
    getLocationById.mockRejectedValue(new NotFoundError());

    await expect(assetSearchManager(queryObject)).rejects.toThrow(
      NotFoundError,
    );

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryObject);
    expect(getLocationById).toHaveBeenCalledWith(criteria.filters.location);
    expect(filteredSearch).not.toHaveBeenCalled();
    expect(filterDictionaryByList).not.toHaveBeenCalled();
  });

  it('returns identical results regardless of serialNumber casing', async () => {
    const lowerCaseQuery = { serialNumber: 'abc123' };
    const upperCaseQuery = { serialNumber: 'ABC123' };

    const sameAssets = [{ id: 'asset-1', serialNumber: 'ABC123' }];

    validateSearchCriteria.mockImplementation(query => ({
      filters: {
        serialNumber: query.serialNumber,
        location: undefined,
        type: undefined,
        unassigned: false,
      },
      limit: 2000,
    }));

    filteredSearch.mockResolvedValue({ items: sameAssets });
    filterDictionaryByList.mockReturnValue(sameAssets);

    const resultLower = await assetSearchManager(lowerCaseQuery);
    const resultUpper = await assetSearchManager(upperCaseQuery);

    expect(resultLower).toEqual(resultUpper);
  });

  // API Controller layer catches this error - we just want to make sure it is passing cleanly here
  it('bubbles up errors from filteredSearch without modification', async () => {
    const queryObject = {
      serialNumber: '123456',
    };

    const criteria = {
      filters: {
        serialNumber: '123456',
        location: undefined,
        type: undefined,
        unassigned: false,
      },
      limit: 2000,
    };

    const error = new InternalServerError('Dataverse failure');

    validateSearchCriteria.mockReturnValue(criteria);
    filteredSearch.mockRejectedValue(error);

    await expect(assetSearchManager(queryObject)).rejects.toBe(error);

    expect(validateSearchCriteria).toHaveBeenCalledWith(queryObject);
    expect(filteredSearch).toHaveBeenCalledWith(criteria);
    expect(filterDictionaryByList).not.toHaveBeenCalled();
  });
});
