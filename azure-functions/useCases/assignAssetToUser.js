import { assignAssetOwner } from '../persistence/assignAssetOwner.js';
import { conditionallyUpdateAssetAuditLog } from './conditionallyUpdateAssetAuditLog.js';

export async function assignAssetToUser(userId, assetId, body) {
  await assignAssetOwner(userId, assetId);
  await conditionallyUpdateAssetAuditLog(assetId, body);
}
