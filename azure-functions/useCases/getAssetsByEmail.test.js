import { BadRequest } from '../errors/BadRequest.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { getDataverseAssetsByEmail } from '../persistence/getDataverseAssetsByEmail.js';
import { getAssetsByEmail } from './getAssetsByEmail.js';

jest.mock('../persistence/getDataverseAssetsByEmail.js', () => ({
  getDataverseAssetsByEmail: jest.fn(),
}));

describe('getAssetsByEmail', () => {
  const testAsset =
    //following is a 1:1 copy from calling the API
    [
      {
        activation: null,
        assetName: 'test asset',
        itemStatus: 'Assigned',
        location: 'UNKNOWN LOCATION',
        osVersion: null,
        phone: null,
        user: {
          email: 'test@test.test',
          isActive: true,
          isContractor: false,
          jobTitle: 'tester',
          location: 'Remote',
        },
      },
    ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Basic tests to ensure the function is being called as expected

  it('calls persistence method correctly using provided email (test@test.test)', async () => {
    await getAssetsByEmail('test@test.test');

    expect(getDataverseAssetsByEmail).toHaveBeenCalledTimes(1);
    expect(getDataverseAssetsByEmail).toHaveBeenCalledWith('test@test.test');
  });

  //Test to see if it will return an expected 1 item list

  it('returns the resolved persistence result', async () => {
    getDataverseAssetsByEmail.mockResolvedValue(testAsset);
    const result = await getAssetsByEmail('test@test.test');
    expect(result).toEqual(testAsset);
  });

  //Basic tests for expected failure states
  it('bubbles up BadRequest errors from persistence layer', async () => {
    getDataverseAssetsByEmail.mockRejectedValue(new BadRequest());
    await expect(getAssetsByEmail('test@test.test')).rejects.toThrow(
      BadRequest,
    );
  });

  it('bubbles up DataverseToken errors from persistence layer', async () => {
    getDataverseAssetsByEmail.mockRejectedValue(new DataverseTokenError());
    await expect(getAssetsByEmail('test@test.test')).rejects.toThrow(
      DataverseTokenError,
    );
  });

  it('bubbles up generic errors from persistence layer', async () => {
    getDataverseAssetsByEmail.mockRejectedValue(new Error());
    await expect(getAssetsByEmail('test@test.test')).rejects.toThrow(Error);
  });

  it('returns an empty array if no items match query', async () => {
    getDataverseAssetsByEmail.mockResolvedValue([]);
    const result = await getAssetsByEmail('test@test.test');
    expect(result).toEqual([]);
  });
});
