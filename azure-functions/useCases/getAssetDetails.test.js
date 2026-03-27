import { getAssetByID } from '../persistence/getAssetByID.js';
import { getAssetDetails } from './getAssetDetails.js';
import { checkDecommissioned } from '../persistence/checkDecommissioned.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('../persistence/checkDecommissioned.js', () => ({
  checkDecommissioned: jest.fn(),
}));

jest.mock('../persistence/getAssetByID.js', () => ({
  getAssetByID: jest.fn(),
}));

describe('getAssetDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    checkDecommissioned.mockResolvedValue(false);
  });

  //Basic tests to ensure the function is being called as expected

  it('calls getAssetByID using provided assetID (12345)', async () => {
    await getAssetDetails('asset123');

    expect(getAssetByID).toHaveBeenCalledTimes(1);
    expect(getAssetByID).toHaveBeenCalledWith('asset123');
  });

  //Test to see if it will return an expected object (without dataverse)

  it('returns the resolved getAssetByID', async () => {
    const testAsset = {
      id: 'asset123',
      deviceType: 'Laptop',
      owner: 'Bob Ross',
    };
    getAssetByID.mockResolvedValue(testAsset);
    const result = await getAssetDetails('asset123');
    expect(result).toEqual(testAsset);
  });

  //Basic tests for expected failure states

  it('throws the same errors expected from getAssetByID', async () => {
    getAssetByID.mockRejectedValue(new Error('404: Asset not found'));
    await expect(getAssetDetails('asset123')).rejects.toThrow(
      '404: Asset not found',
    );
  });

  it('handles getAssetByID returning null', async () => {
    getAssetByID.mockResolvedValue(null);
    const result = await getAssetDetails('asset123');
    expect(result).toBeNull();
  });

  it('handles getAssetByID returning undefined', async () => {
    getAssetByID.mockResolvedValue(undefined);
    const result = await getAssetDetails('asset123');
    expect(result).toBeUndefined();
  });

  it('gracefully handles calls without an assetID', async () => {
    getAssetByID.mockRejectedValue(new Error('404: Asset not found'));
    await expect(getAssetDetails()).rejects.toThrow('404: Asset not found');
  });

  // New tests for decommission functionality
  it('throws NotFoundError when asset is decommissioned', async () => {
    checkDecommissioned.mockResolvedValue(true);

    await expect(getAssetDetails('asset123')).rejects.toThrow(NotFoundError);

    await expect(getAssetDetails('asset123')).rejects.toThrow(
      'This asset has been decommissioned.',
    );

    // Ensure persistence method is not called after decommission check
    expect(getAssetByID).not.toHaveBeenCalled();
  });

  it('calls getAssetByID when asset is not decommissioned', async () => {
    checkDecommissioned.mockResolvedValue(false);

    getAssetByID.mockResolvedValue({
      id: 'asset123',
      deviceType: 'Laptop',
    });

    const result = await getAssetDetails('asset123');

    expect(checkDecommissioned).toHaveBeenCalledTimes(1);
    expect(checkDecommissioned).toHaveBeenCalledWith('asset123');

    expect(getAssetByID).toHaveBeenCalledTimes(1);
    expect(getAssetByID).toHaveBeenCalledWith('asset123');

    expect(result).toEqual({
      id: 'asset123',
      deviceType: 'Laptop',
    });
  });

  it('propagates errors from checkDecommissioned', async () => {
    checkDecommissioned.mockRejectedValue(new Error('Dataverse unavailable'));

    await expect(getAssetDetails('asset123')).rejects.toThrow(
      'Dataverse unavailable',
    );

    expect(getAssetByID).not.toHaveBeenCalled();
  });
});
