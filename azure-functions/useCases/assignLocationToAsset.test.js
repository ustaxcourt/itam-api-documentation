import { assignLocationToAsset } from './assignLocationToAsset';
import { NotFoundError } from '../errors/NotFoundError';
import { DataverseTokenError } from '../errors/DataverseTokenError';

import { assignLocationAsset } from '../persistence/assignAssetLocation';
import { getLocationById } from '../persistence/getLocationById';
import { getAssetByID } from '../persistence/getAssetByID';

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

  it('should throw DataverseTokenError if asset retrieval fails with token error', async () => {
    getLocationById.mockRejectedValue(new DataverseTokenError());

    await expect(assignLocationToAsset(assetId, locationId)).rejects.toThrow(
      DataverseTokenError,
    );
    expect(assignLocationAsset).not.toHaveBeenCalled();
  });
});
