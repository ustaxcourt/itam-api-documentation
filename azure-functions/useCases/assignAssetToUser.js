import { assignAssetOwner } from '../persistence/assignAssetOwner.js';

export async function assignAssetToUser(userId, assetId) {
  await assignAssetOwner(userId, assetId);
}
