import { assetSearchManager } from './assetSearchManager.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { filteredSearch } from '../persistence/filteredSearch.js';
import { filterDictionaryByList } from '../persistence/filterDictbyList.js';
import { getLocationById } from '../persistence/getLocationById.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('../persistence/filteredSearch.js');
jest.mock('../persistence/filterDictbyList.js');
jest.mock('../persistence/getLocationById.js');

describe('assetSearchManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('runs search without location filter and does not validate location', async () => {
    const criteria = {
      filters: {
        serialNumber: '123456',
        location: undefined,
      },
    };

    const rawAssets = [{ id: 1 }, { id: 2 }];
    const filteredAssets = [{ id: 1 }];

    filteredSearch.mockResolvedValue({ items: rawAssets });
    filterDictionaryByList.mockReturnValue(filteredAssets);

    const result = await assetSearchManager(criteria);

    expect(getLocationById).not.toHaveBeenCalled();
    expect(filteredSearch).toHaveBeenCalledWith(criteria);
    expect(filterDictionaryByList).toHaveBeenCalledWith(rawAssets);

    expect(result).toEqual({
      total: filteredAssets.length,
      data: filteredAssets,
    });
  });

  it('validates location when location filter is provided', async () => {
    const criteria = {
      filters: {
        location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      },
    };

    const rawAssets = [{ id: 'asset-1' }];
    const filteredAssets = [{ id: 'asset-1' }];

    getLocationById.mockResolvedValue({ id: criteria.filters.location });
    filteredSearch.mockResolvedValue({ items: rawAssets });
    filterDictionaryByList.mockReturnValue(filteredAssets);

    const result = await assetSearchManager(criteria);

    expect(getLocationById).toHaveBeenCalledWith(criteria.filters.location);
    expect(filteredSearch).toHaveBeenCalledWith(criteria);
    expect(filterDictionaryByList).toHaveBeenCalledWith(rawAssets);

    expect(result).toEqual({
      total: 1,
      data: filteredAssets,
    });
  });

  it('throws NotFoundError if location does not exist', async () => {
    const criteria = {
      filters: {
        location: 'invalid-location-id',
      },
    };

    getLocationById.mockRejectedValue(new NotFoundError());

    await expect(assetSearchManager(criteria)).rejects.toThrow(NotFoundError);

    expect(getLocationById).toHaveBeenCalledWith(criteria.filters.location);
    expect(filteredSearch).not.toHaveBeenCalled();
    expect(filterDictionaryByList).not.toHaveBeenCalled();
  });
  // API Controller layer catches this error - we just want to make sure it is passing cleanly here
  it('bubbles up errors from filteredSearch without modification', async () => {
    const criteria = {
      filters: {
        serialNumber: '123456',
      },
    };

    // Example error type that dataverseCall can throw
    const error = new InternalServerError('Dataverse failure');

    filteredSearch.mockRejectedValue(error);

    await expect(assetSearchManager(criteria)).rejects.toBe(error);

    expect(filteredSearch).toHaveBeenCalledWith(criteria);
    expect(filterDictionaryByList).not.toHaveBeenCalled();
  });
});
