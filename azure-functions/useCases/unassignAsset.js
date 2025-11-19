import { unassignAssetOwner } from '../persistence/unassignAssetOwner.js';

export async function unassignAsset(assetId) {
  await unassignAssetOwner(assetId);
}
