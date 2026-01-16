import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { assignAssetOwner } from '../persistence/assignAssetOwner.js';
import { deleteAssetAuditLogEntry } from '../persistence/deleteAssetAuditLogEntry.js';
import { updateAssetAuditLog } from '../persistence/updateAssetAuditLog.js';
import { updateAssetCondition } from '../persistence/updateAssetCondition.js';
import { withRetry } from '../persistence/withRetry.js';

export async function assignAssetToUser(userId, assetId, body) {
  // Attempt to write to the audit log first, throws error and stops process
  const { auditId, conditionCode } = await updateAssetAuditLog(assetId, body);

  try {
    // Tries to update the condition of the asset in ois_rela_item_org
    await withRetry(() => updateAssetCondition(assetId, conditionCode));

    // Tries to assign the asset to the provided user
    await withRetry(() => assignAssetOwner(userId, assetId));
  } catch (error) {
    try {
      // If either of the above fails, we delete the inital audit log entry
      await deleteAssetAuditLogEntry(auditId);
    } catch (deleteError) {
      console.error(
        `Failed to delete the audit entry: ${auditId}`,
        deleteError.message,
      );
    }

    // Unless specifically called out, useCase swallows errors BE CAREFUL
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new InternalServerError(
      'Assignment failed. Audit entry removed from log history',
    );
  }
}
