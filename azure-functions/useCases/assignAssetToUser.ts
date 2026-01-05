import { assignAssetOwner } from '../persistence/assignAssetOwner.js';

export async function assignAssetToUser(
  userId: string,
  assetId: string,
): Promise<void> {
  await assignAssetOwner(userId, assetId);
}
