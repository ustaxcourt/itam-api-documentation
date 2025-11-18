import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { assignAssetToUser } from './assignAssetToUser.js';
import { assignAssetOwner } from '../persistence/assignAssetOwner.js';

jest.mock('../persistence/assignAssetOwner.js', () => ({
  assignAssetOwner: jest.fn(),
}));

describe('assignAssetToUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls assignAssetOwner with the given userID and assetID', async () => {
    await assignAssetToUser('testUser', 'asset123');

    expect(assignAssetOwner).toHaveBeenCalledTimes(1);
    expect(assignAssetOwner).toHaveBeenCalledWith('testUser', 'asset123');
  });
});
