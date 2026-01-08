import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { dataverseCall } from './dataverseCall.js';

export async function getLatestAssetAuditLogEntry(assetName) {
  try {
    const url = `crf7f_ois_asset_audit_logs?$filter=crf7f_name eq '${assetName}'&$orderby=createdon desc&$top=1`;
    const response = dataverseCall({ query: url, method: 'GET' });
    return response;
  } catch (error) {
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError
    ) {
      console.error('Encountered error:', error.message);
      throw error;
    }

    throw new InternalServerError('Unable to add asset To Asset Audit Log');
  }
}
