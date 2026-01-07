import { assignAssetOwner } from '../persistence/assignAssetOwner.js';
import { addNewAssetToAssetAuditLog } from '../persistence/addNewAssetToAssetAuditLog.js';
import { getChoiceFieldIntegersFromTable } from '../persistence/getChoiceFieldIntegersFromTable.js';
import { getAssetDetails } from './getAssetDetails.js';

export async function assignAssetToUser(userId, assetId, body) {
  await assignAssetOwner(userId, assetId);

  let assetDetails = await getAssetDetails(assetId);
  let choices = await getChoiceFieldIntegersFromTable(
    'crf7f_ois_asset_audit_log',
    'crf7f_condition',
  );

  await addNewAssetToAssetAuditLog(
    assetDetails.assetName,
    choices[assetDetails.condition],
    body.zenDeskTicketId,
    body.notes ?? null,
    'Assignment',
  );
}
