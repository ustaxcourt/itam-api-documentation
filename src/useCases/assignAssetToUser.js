import { saveAssignmentOfAssetToUser } from '../persistence/saveAssignmentOfAssetToUser.js';

export async function assignAssetToUser({ userId, assetId }) {
  const response = await saveAssignmentOfAssetToUser({ userId, assetId });

  // TODO: Add audit log
  // await recordAuditLog({
  //   action: 'assignAssetToUser',
  //   userId: userId,
  //   assetId: assetId,
  // });

  // return response.assignmentId; TODO: do we need to return anything?

  return;
}
