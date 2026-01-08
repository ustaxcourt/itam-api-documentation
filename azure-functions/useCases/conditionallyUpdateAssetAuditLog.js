import { addNewAssetToAssetAuditLog } from '../persistence/addNewAssetToAssetAuditLog.js';
import { getChoiceFieldIntegersFromTable } from '../persistence/getChoiceFieldIntegersFromTable.js';
import { getLatestAssetAuditLogEntryCondition } from '../persistence/getLatestAssetAuditLogEntryCondition.js';
import { getAssetDetails } from './getAssetDetails.js';

export async function conditionallyUpdateAssetAuditLog(assetId, body) {
  let assetDetails = await getAssetDetails(assetId);
  let choices = await getChoiceFieldIntegersFromTable(
    'crf7f_ois_asset_audit_log',
    'crf7f_condition',
  );
  const assetName = assetDetails.assetName.replace(/#/g, '%23');
  const latestCondition = await getLatestAssetAuditLogEntryCondition(assetName);

  if (latestCondition != choices[assetDetails.condition]) {
    await addNewAssetToAssetAuditLog(
      assetDetails.assetName,
      choices[assetDetails.condition],
      body.zenDeskTicketId,
      body.notes ?? null,
      'Asset Assignment',
    );
  }
}
