import { addNewAssetToAssetAuditLog } from '../persistence/addNewAssetToAssetAuditLog.js';
import { getChoiceFieldIntegersFromAssetAuditLogTable } from '../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js';
import { getLatestAssetAuditLogEntryCondition } from '../persistence/getLatestAssetAuditLogEntryCondition.js';
import { getAssetDetails } from './getAssetDetails.js';

export async function conditionallyUpdateAssetAuditLog(assetId, body) {
  const assetDetails = await getAssetDetails(assetId);
  console.log(assetDetails);
  const choices = await getChoiceFieldIntegersFromAssetAuditLogTable();
  console.log(choices);
  const assetName = assetDetails.assetName.replace(/#/g, '%23');
  const latestCondition = await getLatestAssetAuditLogEntryCondition(assetName);

  if (latestCondition != choices[assetDetails.condition]) {
    await addNewAssetToAssetAuditLog(
      assetName,
      choices[assetDetails.condition],
      Number(body.zenDeskTicketId),
      body.notes ?? null,
      'Asset Assignment',
    );
  }
}
