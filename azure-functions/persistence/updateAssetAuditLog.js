import { addNewEntryToAssetAuditLog } from './addNewEntryToAssetAuditLog.js';
import { getAssetDetails } from '../useCases/getAssetDetails.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { AUDIT_LOG_CHOICES } from '../entityConstants.js';

export async function updateAssetAuditLog(assetId, body) {
  // Fetch asset details and choice mapping
  const assetDetails = await getAssetDetails(assetId);
  const choices = AUDIT_LOG_CHOICES;

  // Normalize asset name
  const assetName = assetDetails.assetName;

  // body.condition must exist in request
  const conditionLabel = body?.condition?.trim();

  // Map condition label to integer code
  const conditionCode = choices[conditionLabel];
  if (conditionCode === undefined) {
    throw new InternalServerError(
      `Condition '${conditionLabel}' is not mapped in OptionSet.`,
    );
  }

  // Write audit log entry
  const auditLogResponse = await addNewEntryToAssetAuditLog(
    assetName,
    conditionCode,
    Number(body.zendeskTicketId),
    body?.notes ?? null,
    body?.action ?? null,
  );

  return {
    auditId: auditLogResponse.id ?? null,
    conditionCode,
  };
}
