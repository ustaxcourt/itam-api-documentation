import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { getAssetByID } from '../persistence/getAssetByID.js';
import { getAssetDetails } from './getAssetDetails.js';

jest.mock('../persistence/getAssetByID.js', () => ({
  getAssetByID: jest.fn(),
}));

describe('getAssetDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getAssetByID using provided assetID (12345)', async () => {
    await getAssetDetails('asset123');

    expect(getAssetByID).toHaveBeenCalledTimes(1);
    expect(getAssetByID).toHaveBeenCalledWith('asset123');
  });
});
