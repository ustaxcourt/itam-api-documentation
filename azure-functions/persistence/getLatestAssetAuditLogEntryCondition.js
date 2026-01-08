import { getLatestAssetAuditLogEntry } from './getLatestAssetAuditLogEntry.js';

export async function getLatestAssetAuditLogEntryCondition(assetName) {
  const latest = await getLatestAssetAuditLogEntry(assetName);
  return latest.value[0].crf7f_condition;
}
