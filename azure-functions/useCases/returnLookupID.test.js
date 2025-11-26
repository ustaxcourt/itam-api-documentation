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
      data: {
        value: [{ crf7f_fac_asset_ref_locationid: 'location-guid-123' }],
      },
    };

    dataverseCall.mockResolvedValueOnce(mockResponse);

    const table = 'crf7f_fac_asset_ref_locations';
    const column = 'crf7f_fac_asset_ref_locationid';
    const value = 'loc456';

    const result = await getId(table, column, value);

    const expectedUrl = `${DATAVERSE_URL}/api/data/v9.2/${table}?$filter=${column} eq '${value}'`;

    expect(dataverseCall).toHaveBeenCalledWith(expectedUrl, 'GET');
    expect(result).toBe('location-guid-123');
  });

  it('should handle different table names correctly', async () => {
    const mockResponse = {
      data: {
        value: [{ customtableid: 'custom-guid-789' }],
      },
    };

    dataverseCall.mockResolvedValueOnce(mockResponse);

    const table = 'customtables';
    const column = 'customcolumn';
    const value = 'customValue';

    const result = await getId(table, column, value);

    const expectedUrl = `${DATAVERSE_URL}/api/data/v9.2/${table}?$filter=${column} eq '${value}'`;

    expect(dataverseCall).toHaveBeenCalledWith(expectedUrl, 'GET');
    expect(result).toBe('custom-guid-789');
  });

  it('should throw if dataverseCall fails', async () => {
    dataverseCall.mockRejectedValueOnce(new Error('Network error'));

    await expect(getId('table', 'column', 'value')).rejects.toThrow(
      'Network error',
    );
  });
});
