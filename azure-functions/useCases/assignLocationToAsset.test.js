import { assignLocationToAsset } from './assignLocationToAsset.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

import { assignLocationAsset } from '../persistence/assignAssetLocation.js';
import { getLocationById } from '../persistence/getLocationById.js';
import { getAssetByID } from '../persistence/getAssetByID.js';

jest.mock('../persistence/assignAssetLocation.js');
jest.mock('../persistence/getLocationById.js');
jest.mock('../persistence/getAssetByID.js');

describe('assignLocationToAsset', () => {
  const assetId = 'asset123';
  const locationId = 'location456';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call getLocationById, getAssetByID, and assignLocationAsset successfully', async () => {
    await assignLocationToAsset(assetId, locationId);

    expect(getLocationById).toHaveBeenCalledWith(locationId);
    expect(getAssetByID).toHaveBeenCalledWith(assetId);
    expect(assignLocationAsset).toHaveBeenCalledWith(assetId, locationId);
  });

  it('should throw NotFoundError if location is not found', async () => {
    getLocationById.mockRejectedValue(new NotFoundError());

    await expect(assignLocationToAsset(assetId, locationId)).rejects.toThrow(
      NotFoundError,
    );
    expect(getAssetByID).not.toHaveBeenCalled();
    expect(assignLocationAsset).not.toHaveBeenCalled();
  });

  it('should throw InternalServerError for unknown error in getLocationById', async () => {
    getLocationById.mockRejectedValue(new Error('Unknown error'));

    await expect(assignLocationToAsset(assetId, locationId)).rejects.toThrow(
      InternalServerError,
    );
  });

  it('should throw DataverseTokenError if asset retrieval fails with token error', async () => {
    getLocationById.mockRejectedValue(new DataverseTokenError());

    await expect(assignLocationToAsset(assetId, locationId)).rejects.toThrow(
      DataverseTokenError,
    );
    expect(assignLocationAsset).not.toHaveBeenCalled();
  });

  it('should throw InternalServerError for unknown error in getAssetByID', async () => {
    getLocationById.mockResolvedValue({});
    getAssetByID.mockRejectedValue(new Error('Unknown error'));

    await expect(assignLocationToAsset(assetId, locationId)).rejects.toThrow(
      InternalServerError,
    );
  });
});
