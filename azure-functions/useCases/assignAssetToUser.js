import { assignAssetOwner } from '../persistence/assignAssetOwner.js';
import { updateAssetAuditLog } from './updateAssetAuditLog.js';

export async function assignAssetToUser(userId, assetId, body) {
  await assignAssetOwner(userId, assetId);
  await updateAssetAuditLog(assetId, body);
}
