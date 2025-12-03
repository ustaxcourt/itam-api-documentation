import { unassignLocationToAsset } from './unassignLocationToAsset.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

import { unassignLocationAsset } from '../persistence/unassignAssetLocation.js';
import { getAssetByID } from '../persistence/getAssetByID.js';

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

  it('should throw InternalServerError for unknown error in getAssetByID', async () => {
    getAssetByID.mockRejectedValue(new Error('Unknown error'));

    await expect(unassignLocationToAsset(assetId)).rejects.toThrow(
      InternalServerError,
    );
  });

  it('should throw DataverseTokenError if asset retrieval fails with token error', async () => {
    getAssetByID.mockRejectedValue(new DataverseTokenError());

    await expect(unassignLocationToAsset(assetId)).rejects.toThrow(
      DataverseTokenError,
    );
    expect(unassignLocationAsset).not.toHaveBeenCalled();
  });
});
