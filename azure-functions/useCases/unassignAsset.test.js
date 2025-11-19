import { unassignAsset } from './unassignAsset.js';
import { unassignAssetOwner } from '../persistence/unassignAssetOwner.js';

jest.mock('../persistence/unassignAssetOwner.js', () => ({
  unassignAssetOwner: jest.fn(),
}));

describe('unassignAsset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //extremely basic test suite placeholder
  it('tests unassignAsset using a given asset and user', async () => {
    await unassignAsset('asset123');

    expect(unassignAssetOwner).toHaveBeenCalledTimes(1);
    expect(unassignAssetOwner).toHaveBeenCalledWith('asset123');
  });

  //Basic tests for expected failure modes
  it('throws errors like unassignAssetOwner', async () => {
    unassignAssetOwner.mockRejectedValue(new Error('XXX: asset not found'));
    await expect(unassignAsset('asset123')).rejects.toThrow(
      'XXX: asset not found',
    );
  });

  it('handles empty calls', async () => {
    unassignAssetOwner.mockRejectedValue(new Error('XXX: asset not found'));
    await expect(unassignAsset()).rejects.toThrow('XXX: asset not found');
  });
});
