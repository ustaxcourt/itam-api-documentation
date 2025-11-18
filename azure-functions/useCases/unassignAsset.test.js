import { describe, beforeEach, it, expect, jest } from '@jest/globals';
import { unassignAsset } from './unassignAsset.js';
import { unassignAssetOwner } from '../persistence/unassignAssetOwner.js';

jest.mock('../persistence/unassignAssetOwner.js', () => ({
  unassignAssetOwner: jest.fn(),
}));

describe('unassignAsset', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('tests unassignAsset using a given asset and user', async () => {
    await unassignAsset('asset123');

    expect(unassignAssetOwner).toHaveBeenCalledTimes(1);
    expect(unassignAssetOwner).toHaveBeenCalledWith('asset123');
  });
});
