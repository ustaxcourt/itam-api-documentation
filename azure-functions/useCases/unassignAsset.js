import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { deleteAssetAuditLogEntry } from '../persistence/deleteAssetAuditLogEntry.js';
import { unassignAssetOwner } from '../persistence/unassignAssetOwner.js';
import { updateAssetAuditLog } from '../persistence/updateAssetAuditLog.js';
import { updateAssetCondition } from '../persistence/updateAssetCondition.js';
import { withRetry } from '../persistence/withRetry.js';

export async function unassignAsset(assetId, body) {
  // Attempt to write to the audit log first, stops the whole process on an error
  const { auditId, conditionCode } = await updateAssetAuditLog(assetId, body);

  try {
    // Tries to update rela_item_org condition status
    await withRetry(() => updateAssetCondition(assetId, conditionCode));

    // Tries to unassign the asset
    await withRetry(() => unassignAssetOwner(assetId));
  } catch (error) {
    try {
      // If either of the above fails, we delete the initial audit log entry
      await deleteAssetAuditLogEntry(auditId);
    } catch (deleteError) {
      console.error(
        `Failed to delete the audit entry: ${auditId}`,
        deleteError.message,
      );
    }
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new InternalServerError(
      'Assignment failed. Audit entry removed from log history',
    );
  }
}
