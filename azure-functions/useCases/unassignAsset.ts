import { unassignAssetOwner } from '../persistence/unassignAssetOwner.js';

export async function unassignAsset(assetId: string): Promise<void> {
  await unassignAssetOwner(assetId);
}
