import { unassignLocationToAsset } from './unassignLocationToAsset';
import { NotFoundError } from '../errors/NotFoundError';
import { DataverseTokenError } from '../errors/DataverseTokenError';

import { unassignLocationAsset } from '../persistence/unassignAssetLocation';
import { getAssetByID } from '../persistence/getAssetByID';

jest.mock('../persistence/unassignAssetLocation.js');
jest.mock('../persistence/getAssetByID.js');

describe('unassignLocationToAsset', () => {
  const assetId = 'asset123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getAssetByID and unassignLocationAsset successfully', async () => {
    await unassignLocationToAsset(assetId);
    expect(getAssetByID).toHaveBeenCalledWith(assetId);
    expect(unassignLocationAsset).toHaveBeenCalledWith(assetId);
  });

  it('should throw NotFoundError if asset is not found', async () => {
    getAssetByID.mockRejectedValue(new NotFoundError());

    await expect(unassignLocationToAsset(assetId)).rejects.toThrow(
      NotFoundError,
    );
    expect(unassignLocationAsset).not.toHaveBeenCalled();
  });

  it('should throw DataverseTokenError if asset retrieval fails with token error', async () => {
    getAssetByID.mockRejectedValue(new DataverseTokenError());

    await expect(unassignLocationToAsset(assetId)).rejects.toThrow(
      DataverseTokenError,
    );
    expect(unassignLocationAsset).not.toHaveBeenCalled();
  });
});
