import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { getChoiceFieldIntegersFromAssetAuditLogTable } from '../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js';
import { getAssetDetails } from './getAssetDetails.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { updateAssetCondition } from '../persistence/updateAssetCondition.js';

export async function updateAssetAuditLog(assetId, body) {
  // Fetch asset details and choice mapping
  const assetDetails = await getAssetDetails(assetId);
  const choices = await getChoiceFieldIntegersFromAssetAuditLogTable();

  // Normalize asset name
  const assetName = assetDetails.assetName.replace(/#/g, '%23');

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
  await addNewEntryToAssetAuditLog(
    assetName,
    conditionCode,
    Number(body.zenDeskTicketId),
    body?.notes ?? null,
    body?.action ?? null,
  );

  // Run update to condition field in base table
  updateAssetCondition(assetId, conditionCode);
}
