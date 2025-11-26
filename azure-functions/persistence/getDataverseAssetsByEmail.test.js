import { dataverseCall } from './dataverseCall.js';
import { filterDictionaryByList } from './filterDictbyList.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { getDataverseAssetsByEmail } from './getDataverseAssetsByEmail.js';
import { expect } from '@jest/globals';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('./dataverseCall.js', () => ({
  dataverseCall: jest.fn(),
}));

jest.mock('./filterDictbyList.js', () => ({
  filterDictionaryByList: jest.fn(),
}));

describe('getDataverseAssetsByEmail', () => {
  process.env.DATAVERSE_URL = 'TEST_URL';
  const testArray = [
    { assetName: 'test1', user: { email: 'test@test.test' } },
    { assetName: 'test2', user: { email: 'test@test.test' } },
  ];
  const validURL =
    `TEST_URL/crf7f_ois_asset_rela_item_orgs` +
    `?$filter=crf7f_ois_asset_entra_dat_userCurrentOw/crf7f_email eq 'test@test.test'` +
    `&$expand=crf7f_ois_asset_entra_dat_userCurrentOw($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_location)`;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds the URL correctly', async () => {
    //needed so the test runs through, otherwise dataverseCall returns undef
    dataverseCall.mockResolvedValue({ data: { value: [] } });
    filterDictionaryByList.mockReturnValue([]);

    await getDataverseAssetsByEmail('test@test.test');
    const calledURL = dataverseCall.mock.calls[0][0];
    expect(calledURL).toBe(validURL);
  });

  it('invokes dataverseCall with the correct arguments', async () => {
    //needed so the test runs through, otherwise dataverseCall returns undef
    dataverseCall.mockResolvedValue({ data: { value: [] } });
    filterDictionaryByList.mockReturnValue([]);

    await getDataverseAssetsByEmail('test@test.test');
    expect(dataverseCall).toHaveBeenCalledWith(validURL, 'GET');
  });

  it('returns filtered array matching query', async () => {
    dataverseCall.mockResolvedValue({ data: { value: testArray } });
    filterDictionaryByList.mockReturnValue(testArray);

    const result = await getDataverseAssetsByEmail('test@test.test');
    expect(result).toEqual(testArray);
  });

  it('bubbles up InternalServerError from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new InternalServerError());
    await expect(getDataverseAssetsByEmail('test@test.test')).rejects.toThrow(
      InternalServerError,
    );
  });

  it('bubbles up DataverseTokenError from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new DataverseTokenError());
    await expect(getDataverseAssetsByEmail('test@test.test')).rejects.toThrow(
      DataverseTokenError,
    );
  });

  it('throws its own InternalServerError if it encounters a problem', async () => {
    dataverseCall.mockRejectedValue(
      new Error('The problem is not with dataverseCall but this function'),
    );
    await expect(getDataverseAssetsByEmail('test@test.test')).rejects.toThrow(
      InternalServerError,
    );
  });
});
