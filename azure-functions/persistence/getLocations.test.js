import { getLocations } from './getLocations.js';
import { dataverseCall } from './dataverseCall.js';
import { filterDictionaryByListLocation } from './filterDictListLocation.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('./dataverseCall.js');
jest.mock('./filterDictListLocation.js');

describe('getLocations', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return transformed locations when data exists', async () => {
    const mockResponse = {
      value: [{ id: 1 }, { id: 2 }],
    };

    const transformed = [{ name: 'Location1' }, { name: 'Location2' }];

    dataverseCall.mockResolvedValue(mockResponse);
    filterDictionaryByListLocation.mockReturnValue(transformed);

    const result = await getLocations();

    expect(dataverseCall).toHaveBeenCalledWith({
      query: 'crf7f_fac_asset_ref_locations',
      method: 'GET',
    });

    expect(filterDictionaryByListLocation).toHaveBeenCalledWith(
      mockResponse.value,
    );

    expect(result).toEqual(transformed);
  });

  it('should throw NotFoundError when value array is empty', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getLocations()).rejects.toThrow(
      new NotFoundError('No locations found'),
    );
  });

  it('should propagate errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Dataverse failure'));

    await expect(getLocations()).rejects.toThrow(
      new Error('Dataverse failure'),
    );
  });

  it('should handle a single location correctly', async () => {
    const mockResponse = {
      value: [{ id: 1 }],
    };

    const transformed = [{ name: 'Single Location' }];

    dataverseCall.mockResolvedValue(mockResponse);
    filterDictionaryByListLocation.mockReturnValue(transformed);

    const result = await getLocations();

    expect(result).toEqual(transformed);
    expect(filterDictionaryByListLocation).toHaveBeenCalledTimes(1);
  });
});
