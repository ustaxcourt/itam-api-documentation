import { assignAssetToUser } from './assignAssetToUser.js';
import { assignAssetOwner } from '../persistence/assignAssetOwner.js';

jest.mock('../persistence/assignAssetOwner.js', () => ({
  assignAssetOwner: jest.fn(),
}));

describe('assignAssetToUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Basic test if function is being called correctly
  it('calls assignAssetOwner with the given userID and assetID', async () => {
    await assignAssetToUser('testUser', 'asset123');

    expect(assignAssetOwner).toHaveBeenCalledTimes(1);
    expect(assignAssetOwner).toHaveBeenCalledWith('testUser', 'asset123');
  });

  //Basic tests for expected failure modes
  it('throws errors like assignAssetOwner', async () => {
    assignAssetOwner.mockRejectedValue(new Error('XXX: user not found'));
    await expect(assignAssetToUser('user123', 'asset123')).rejects.toThrow(
      'XXX: user not found',
    );
  });

  it('handles empty calls', async () => {
    assignAssetOwner.mockRejectedValue(new Error('XXX: user not found'));
    await expect(assignAssetToUser()).rejects.toThrow('XXX: user not found');
  });
});
