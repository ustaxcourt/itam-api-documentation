import { getId } from './returnLookupID.js';
import { dataverseCall } from '../persistence/dataverseCall.js';

jest.mock('../persistence/dataverseCall.js');

describe('getId', () => {
  const DATAVERSE_URL = 'https://mocked-dataverse-url';
  beforeEach(() => {
    process.env.DATAVERSE_URL = DATAVERSE_URL;
    jest.clearAllMocks();
  });

  it('should build correct URL and return ID from response', async () => {
    const mockResponse = {
      value: [{ crf7f_fac_asset_ref_locationid: 'location-guid-123' }],
    };

    dataverseCall.mockResolvedValueOnce(mockResponse);

    const table = 'crf7f_fac_asset_ref_locations';
    const column = 'crf7f_fac_asset_ref_locationid';
    const value = 'loc456';

    const result = await getId({ table: table, column: column, value: value });

    const expectedUrl = `${table}?$filter=${column} eq '${value}'`;

    expect(dataverseCall).toHaveBeenCalledWith({
      query: expectedUrl,
      method: 'GET',
    });
    expect(result).toBe('location-guid-123');
  });

  it('should handle different table names correctly', async () => {
    const mockResponse = {
      value: [{ customtableid: 'custom-guid-789' }],
    };

    dataverseCall.mockResolvedValueOnce(mockResponse);

    const table = 'customtables';
    const column = 'customcolumn';
    const value = 'customValue';

    const result = await getId({ table: table, column: column, value: value });

    const expectedUrl = `${table}?$filter=${column} eq '${value}'`;

    expect(dataverseCall).toHaveBeenCalledWith({
      query: expectedUrl,
      method: 'GET',
    });
    expect(result).toBe('custom-guid-789');
  });
});
