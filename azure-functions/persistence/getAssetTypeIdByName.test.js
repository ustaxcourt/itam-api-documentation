import { getAssetTypeIdByName } from './getAssetTypeIdByName.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./dataverseCall.js', () => ({
  dataverseCall: jest.fn(),
}));

describe('getAssetTypeIdByName', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns asset type ID when exact name match exists', async () => {
    const typeName = 'iPhone';

    const mockResponse = {
      value: [
        {
          crf7f_ois_asset_ref_typeid: '11111111-2222-3333-4444-555555555555',
        },
      ],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await getAssetTypeIdByName(typeName);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      method: 'GET',
      query:
        'crf7f_ois_asset_ref_types' +
        '?$select=crf7f_ois_asset_ref_typeid' +
        `&$filter=crf7f_name eq '${typeName}'`,
    });

    expect(result).toBe('11111111-2222-3333-4444-555555555555');
  });

  test('returns null when no matching asset type is found', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    const result = await getAssetTypeIdByName('NonexistentType');

    expect(result).toBeNull();
  });

  test('returns null when typeName is undefined', async () => {
    const result = await getAssetTypeIdByName(undefined);

    expect(dataverseCall).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  // Impossible case given table structure, but good to confirm behavior if it were to occur
  test('returns first match if multiple asset types are returned', async () => {
    const mockResponse = {
      value: [
        { crf7f_ois_asset_ref_typeid: 'type-1' },
        { crf7f_ois_asset_ref_typeid: 'type-2' },
      ],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await getAssetTypeIdByName('iPhone');

    expect(result).toBe('type-1');
  });
});
