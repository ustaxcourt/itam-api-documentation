import { assignLocationToAsset } from './assignLocationToAsset.js';
import { assignLocationAsset } from '../persistence/assignAssetLocation.js';
import { getId } from '../useCases/returnLookupID.js';

jest.mock('../persistence/assignAssetLocation.js', () => ({
  assignLocationAsset: jest.fn(),
}));

jest.mock('../useCases/returnLookupID.js', () => ({
  getId: jest.fn(),
}));

describe('assignLocationToAsset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic test if function calls dependencies correctly
  it('calls getId and assignLocationAsset with correct arguments', async () => {
    getId.mockResolvedValue('location123');
    assignLocationAsset.mockResolvedValue();

    await assignLocationToAsset('assetABC', 'locationName');

    expect(getId).toHaveBeenCalledTimes(1);
    expect(getId).toHaveBeenCalledWith(
      'crf7f_fac_asset_ref_locations',
      'crf7f_fac_asset_ref_locationid',
      'locationName',
    );
    expect(assignLocationAsset).toHaveBeenCalledTimes(1);
    expect(assignLocationAsset).toHaveBeenCalledWith('assetABC', 'location123');
  });

  // Expected failure mode: Location ID not found
  it('throws error when getId fails', async () => {
    getId.mockRejectedValue(new Error('Location not found'));

    await expect(
      assignLocationToAsset('assetABC', 'locationName'),
    ).rejects.toThrow('Location ID not found');
  });

  // Expected failure mode: Asset ID not found
  it('throws error when assignLocationAsset fails', async () => {
    getId.mockResolvedValue('location123');
    assignLocationAsset.mockRejectedValue(new Error('Asset not found'));

    await expect(
      assignLocationToAsset('assetABC', 'locationName'),
    ).rejects.toThrow('Asset ID not found');
  });

  // Handles passUp error correctly
  it('rethrows error when passUp is true', async () => {
    getId.mockResolvedValue('location123');
    const error = new Error('Pass up error');
    error.passUp = true;
    assignLocationAsset.mockRejectedValue(error);

    await expect(
      assignLocationToAsset('assetABC', 'locationName'),
    ).rejects.toThrow('Pass up error');
  });

  // Handles empty calls
  it('handles empty calls gracefully', async () => {
    getId.mockRejectedValue(new Error('Location not found'));

    await expect(assignLocationToAsset()).rejects.toThrow(
      'Location ID not found',
    );
  });
});
