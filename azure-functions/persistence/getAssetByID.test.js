import { getAssetByID } from './getAssetByID.js';
import { dataverseCall } from './dataverseCall.js';
import { filterDictionary } from './filterDict.js';

jest.mock('./dataverseCall.js');
jest.mock('./filterDict.js');

describe('getAssetByID', () => {
  const originalEnv = process.env.DATAVERSE_URL;

  beforeAll(() => {
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url';
  });

  afterAll(() => {
    process.env.DATAVERSE_URL = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call dataverseCall with correct URL and return filtered data', async () => {
    const mockResponse = {
      value: [{ id: 'asset123', name: 'Laptop' }],
    };
    dataverseCall.mockResolvedValue(mockResponse);
    filterDictionary.mockReturnValue({ id: 'asset123', name: 'Laptop' });

    const assetId = 'asset123';
    const result = await getAssetByID(assetId);

    const expectedUrl = `https://fake.dataverse.url/api/data/v9.2/crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${assetId}'&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_entra_object_id,crf7f_phone,crf7f_location)`;

    expect(dataverseCall).toHaveBeenCalledWith(expectedUrl, 'GET');
    expect(filterDictionary).toHaveBeenCalledWith(mockResponse.value[0]);
    expect(result).toEqual({ id: 'asset123', name: 'Laptop' });
  });

  it('should throw an error when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getAssetByID('asset123')).rejects.toThrow(
      /^No asset found for ID: .+$/,
    );
  });

  it('should propagate errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(getAssetByID('asset123')).rejects.toThrow('Network failure');
  });

  it('should handle missing DATAVERSE_URL gracefully', async () => {
    process.env.DATAVERSE_URL = undefined;

    await expect(getAssetByID('asset123')).rejects.toThrow();
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url'; // restores for other tests
  });
});
