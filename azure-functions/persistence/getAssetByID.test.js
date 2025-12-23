import { getAssetByID } from './getAssetByID';
import { dataverseCall } from './dataverseCall';
import { filterDictionary } from './filterDict';
import { NotFoundError } from '../errors/NotFoundError';

jest.mock('./dataverseCall.js');
jest.mock('./filterDict.js');

describe('getAssetByID', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call dataverseCall with correct URL and return filtered data', async () => {
    const mockResponse = {
      value: [{ id: 'asset123', name: 'Laptop' }],
    };
    dataverseCall.mockResolvedValue(mockResponse);
    filterDictionary.mockReturnValue({ id: 'asset123', name: 'Laptop' });

    const assetId = 'asset123';
    const result = await getAssetByID(assetId);

    const expectedQuery = `crf7f_ois_asset_rela_item_orgs?$filter=crf7f_ois_asset_rela_item_orgid eq '${assetId}'&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_entra_object_id,crf7f_phone,crf7f_location)`;

    expect(dataverseCall).toHaveBeenCalledWith({
      query: expectedQuery,
      method: 'GET',
    });
    expect(filterDictionary).toHaveBeenCalledWith(mockResponse.value[0]);
    expect(result).toEqual({ id: 'asset123', name: 'Laptop' });
  });

  it('should throw an error when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getAssetByID('asset123')).rejects.toThrow(
      new NotFoundError('No asset found for ID: asset123'),
    );
  });

  it('should propagate errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(getAssetByID('asset123')).rejects.toThrow('Network failure');
  });
});
