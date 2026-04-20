import { filteredSearch } from './filteredSearch.js';
import { dataverseCall } from '../persistence/dataverseCall.js';

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
        isUnassigned: undefined,
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
        "?$filter=crf7f_serial_number eq '1234567' and (crf7f_decommissioned eq false or crf7f_decommissioned eq null)" +
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
        isUnassigned: undefined,
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
        '?$filter=_crf7f_fac_asset_ref_location_lookup_value eq aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee and (crf7f_decommissioned eq false or crf7f_decommissioned eq null)' +
        `&$orderby=crf7f_name asc` +
        `&$top=${criteria.limit}`,
    });

    expect(result).toEqual({
      items: mockResponse.value,
    });
  });

  test('builds correct query with isUnassigned filter only', async () => {
    const criteria = {
      filters: {
        location: undefined,
        serialNumber: undefined,
        isUnassigned: 'true',
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
        '?$filter=crf7f_asset_item_status eq 1 and (crf7f_decommissioned eq false or crf7f_decommissioned eq null)' +
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
        isUnassigned: undefined,
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
        ' and (crf7f_decommissioned eq false or crf7f_decommissioned eq null)' +
        `&$orderby=crf7f_name asc` +
        `&$top=${criteria.limit}`,
    });

    expect(result).toEqual({
      items: mockResponse.value,
    });
  });

  test('ensures decommissioned filter is always included', async () => {
    const criteria = {
      filters: {
        serialNumber: '1234567',
        location: undefined,
        isUnassigned: undefined,
      },
      sort: {
        field: 'crf7f_name',
        direction: 'asc',
      },
      limit: 2000,
    };

    const mockResponse = {
      value: [{ id: 'asset-7' }],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await filteredSearch(criteria);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      method: 'GET',
      query:
        'crf7f_ois_assetses' +
        "?$filter=crf7f_serial_number eq '1234567' and (crf7f_decommissioned eq false or crf7f_decommissioned eq null)" +
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
        isUnassigned: 'false',

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

    // This piece makes it so ordering is not important - this test came back in a random order so this still asserts we get back what we expect
    // Just not in any particular order
    const callArg = dataverseCall.mock.calls[0][0];
    expect(callArg.method).toBe('GET');
    expect(callArg.query).toContain('crf7f_ois_assetses');

    // Assert required filters exist
    expect(callArg.query).toContain("crf7f_serial_number eq '1234567'");
    expect(callArg.query).toContain('crf7f_asset_item_status eq 0');

    // Assert decommissioned filter is included
    expect(callArg.query).toContain(
      '(crf7f_decommissioned eq false or crf7f_decommissioned eq null)',
    );

    // Assert sort + limit
    expect(callArg.query).toContain('&$orderby=crf7f_name asc');
    expect(callArg.query).toContain(`&$top=${criteria.limit}`);

    // Assert unknown filter is NOT included
    expect(callArg.query).not.toContain('random');

    expect(result).toEqual({
      items: mockResponse.value,
    });
  });
});
