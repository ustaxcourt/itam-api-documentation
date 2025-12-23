import { unassignAssetOwner } from '../persistence/unassignAssetOwner';

export async function unassignAsset(assetId) {
  await unassignAssetOwner(assetId);
}
