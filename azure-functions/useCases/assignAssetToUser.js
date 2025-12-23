import { assignAssetOwner } from '../persistence/assignAssetOwner';

export async function assignAssetToUser(userId, assetId) {
  await assignAssetOwner(userId, assetId);
}
