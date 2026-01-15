import { assignAssetOwner } from '../persistence/assignAssetOwner.js';
import { updateAssetAuditLog } from '../persistence/updateAssetAuditLog.js';

export async function assignAssetToUser(userId, assetId, body) {
  await assignAssetOwner(userId, assetId);
  await updateAssetAuditLog(assetId, body);
}
