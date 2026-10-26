import { dataverseCall } from './dataverseCall.js';
import { filterDictionaryByList } from './filterDictbyList.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { getDataverseAssetsByEmail } from './getDataverseAssetsByEmail.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('./dataverseCall.js', () => ({
  dataverseCall: jest.fn(),
}));

jest.mock('./filterDictbyList.js', () => ({
  filterDictionaryByList: jest.fn(),
}));

describe('getDataverseAssetsByEmail', () => {
  const expectedUrl =
    `crf7f_ois_assetses` +
    `?$filter=crf7f_userCurrentOwnerLookup/crf7f_email eq 'test@test.test'` +
    `&$expand=crf7f_userCurrentOwnerLookup($select=crf7f_email,crf7f_jobtitle,crf7f_name,crf7f_isactive,crf7f_iscontractor,crf7f_location),crf7f_ois_asset_ref_model_lookup($select=crf7f_warrantyinformation)`;

  const testArray = [
    { assetName: 'test1', user: { email: 'test@test.test' } },
    { assetName: 'test2', user: { email: 'test@test.test' } },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('builds the URL correctly', async () => {
    dataverseCall.mockResolvedValue({ value: [] });
    filterDictionaryByList.mockReturnValue([]);

    await getDataverseAssetsByEmail('test@test.test');
    const callArgs = dataverseCall.mock.calls[0][0];

    expect(callArgs.query).toBe(expectedUrl);
    expect(callArgs.method).toBe('GET');
  });

  it('invokes dataverseCall with the correct arguments', async () => {
    dataverseCall.mockResolvedValue({ value: [] });
    filterDictionaryByList.mockReturnValue([]);

    await getDataverseAssetsByEmail('test@test.test');

    expect(dataverseCall).toHaveBeenCalledWith({
      query: expectedUrl,
      method: 'GET',
    });
  });

  it('returns filtered array matching query', async () => {
    dataverseCall.mockResolvedValue({ value: testArray });
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

  it('throws its own InternalServerError on unexpected errors', async () => {
    dataverseCall.mockRejectedValue(new Error('unexpected'));

    await expect(getDataverseAssetsByEmail('test@test.test')).rejects.toThrow(
      InternalServerError,
    );
  });
});
