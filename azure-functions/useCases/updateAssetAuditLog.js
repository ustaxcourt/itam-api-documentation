import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { getChoiceFieldIntegersFromAssetAuditLogTable } from '../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js';
import { getAssetDetails } from './getAssetDetails.js';
import { InternalServerError } from '../errors/InternalServerError.js';

export async function updateAssetAuditLog(assetId, body) {
  // Fetch asset details and choice mapping
  const assetDetails = await getAssetDetails(assetId);
  const choices = await getChoiceFieldIntegersFromAssetAuditLogTable();

  // Normalize asset name
  const assetName = assetDetails.assetName.replace(/#/g, '%23');

  // Determine which condition to use:
  //    - If body.condition exists and is non-empty, use that
  //    - Otherwise, fall back to assetDetails.condition
  const conditionLabel = body?.condition?.trim() || assetDetails.condition;

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
    'Asset Assignment', // this can be customized if desired to function based on user input or this default as well
  );
}
