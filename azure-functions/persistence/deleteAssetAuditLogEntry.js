import { dataverseCall } from './dataverseCall.js';

export async function deleteAssetAuditLogEntry(auditId) {
  const query = `crf7f_ois_asset_audit_logs(${auditId})`;
  await dataverseCall({ query, method: 'DELETE' });
}
