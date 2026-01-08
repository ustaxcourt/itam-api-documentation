import { assignAssetOwner } from '../persistence/assignAssetOwner.js';
import { addNewAssetToAssetAuditLog } from '../persistence/addNewAssetToAssetAuditLog.js';
import { getChoiceFieldIntegersFromTable } from '../persistence/getChoiceFieldIntegersFromTable.js';
import { getLatestAssetAuditLogEntryCondition } from '../persistence/getLatestAssetAuditLogEntryCondition.js';
import { getAssetDetails } from './getAssetDetails.js';

export async function assignAssetToUser(userId, assetId, body) {
  await assignAssetOwner(userId, assetId);
  console.log('getting asset details');
  let assetDetails = await getAssetDetails(assetId);
  console.log('getting choices');
  let choices = await getChoiceFieldIntegersFromTable(
    'crf7f_ois_asset_audit_log',
    'crf7f_condition',
  );
  console.log('replacing hastags');
  const assetName = assetDetails.assetName.replace(/#/g, '%23');
  console.log('getting latest conditions');
  const latestCondition = await getLatestAssetAuditLogEntryCondition(assetName);

  if (latestCondition != choices[assetDetails.condition]) {
    console.log('added to audit log');
    await addNewAssetToAssetAuditLog(
      assetDetails.assetName,
      choices[assetDetails.condition],
      body.zenDeskTicketId,
      body.notes ?? null,
      'Assignment',
    );
  }
}
