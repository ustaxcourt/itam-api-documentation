import { filteredSearch } from './filteredSearch.js';
import { dataverseCall } from '../persistence/dataverseCall.js';
import { BadRequest } from '../errors/BadRequest.js';

jest.mock('../persistence/dataverseCall.js', () => ({
  dataverseCall: jest.fn(),
}));

describe('filteredSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('builds correct query with serialNumber filter only', async () => {
    const criteria = {
      filters: {
        serialNumber: '1234567',
        location: undefined,
        unassigned: false,
      },
      sort: {
        field: 'crf7f_name',
        direction: 'asc',
      },
      limit: 2000,
    };

    const mockResponse = {
      value: [{ id: 'asset-1' }, { id: 'asset-2' }],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await filteredSearch(criteria);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      method: 'GET',
      query:
        'crf7f_ois_assetses' +
        "?$filter=crf7f_serial_number eq '1234567'" +
        `&$orderby=crf7f_name asc` +
        `&$top=${criteria.limit}`,
    });

    expect(result).toEqual({
      items: mockResponse.value,
    });
  });

  test('builds correct query with location filter only', async () => {
    const criteria = {
      filters: {
        location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
        serialNumber: undefined,
        unassigned: false,
      },
      sort: {
        field: 'crf7f_name',
        direction: 'asc',
      },
      limit: 2000,
    };

    const mockResponse = {
      value: [{ id: 'asset-3' }, { id: 'asset-4' }],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await filteredSearch(criteria);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      method: 'GET',
      query:
        'crf7f_ois_assetses' +
        '?$filter=_crf7f_fac_asset_ref_location_lookup_value eq aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee' +
        `&$orderby=crf7f_name asc` +
        `&$top=${criteria.limit}`,
    });

    expect(result).toEqual({
      items: mockResponse.value,
    });
  });

  test('builds correct query with unassigned filter only', async () => {
    const criteria = {
      filters: {
        location: undefined,
        serialNumber: undefined,
        unassigned: true,
      },
      sort: {
        field: 'crf7f_name',
        direction: 'asc',
      },
      limit: 2000,
    };

    const mockResponse = {
      value: [{ id: 'asset-5' }, { id: 'asset-6' }],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await filteredSearch(criteria);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      method: 'GET',
      query:
        'crf7f_ois_assetses' +
        '?$filter=crf7f_asset_item_status eq 1' +
        `&$orderby=crf7f_name asc` +
        `&$top=${criteria.limit}`,
    });

    expect(result).toEqual({
      items: mockResponse.value,
    });
  });

  test('builds correct query with location AND serialNumber filters', async () => {
    const criteria = {
      filters: {
        location: '11111111-2222-3333-4444-555555555555',
        serialNumber: 'ABC123',
        unassigned: false,
      },
      sort: {
        field: 'crf7f_name',
        direction: 'asc',
      },
      limit: 2000,
    };

    const mockResponse = {
      value: [{ id: 'asset-42' }],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await filteredSearch(criteria);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      method: 'GET',
      query:
        'crf7f_ois_assetses' +
        '?$filter=' +
        '_crf7f_fac_asset_ref_location_lookup_value eq 11111111-2222-3333-4444-555555555555' +
        " and crf7f_serial_number eq 'ABC123'" +
        `&$orderby=crf7f_name asc` +
        `&$top=${criteria.limit}`,
    });

    expect(result).toEqual({
      items: mockResponse.value,
    });
  });

  test('ignores unknown filter fields and still searches using valid filters', async () => {
    const criteria = {
      filters: {
        serialNumber: '1234567',
        location: undefined,
        unassigned: false,

        // Unknown/nonsense filter should be ignored
        random: 'random-value',
      },
      sort: {
        field: 'crf7f_name',
        direction: 'asc',
      },
      limit: 2000,
    };

    const mockResponse = {
      value: [{ id: 'asset-123' }],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await filteredSearch(criteria);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      method: 'GET',
      query:
        'crf7f_ois_assetses' +
        "?$filter=crf7f_serial_number eq '1234567'" +
        `&$orderby=crf7f_name asc` +
        `&$top=${criteria.limit}`,
    });

    expect(result).toEqual({
      items: mockResponse.value,
    });
  });

  test('throws BadRequest when no valid filters are provided', async () => {
    const criteria = {
      filters: {
        location: undefined,
        serialNumber: undefined,
        unassigned: false,
      },
      sort: {
        field: 'crf7f_name',
        direction: 'asc',
      },
      limit: 2000,
    };

    await expect(filteredSearch(criteria)).rejects.toThrow(BadRequest);
    await expect(filteredSearch(criteria)).rejects.toThrow(
      'No valid filters provided for asset search',
    );

    expect(dataverseCall).not.toHaveBeenCalled();
  });
});
