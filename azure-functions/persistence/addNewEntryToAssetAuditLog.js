import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { dataverseCall } from './dataverseCall.js';

export async function addNewEntryToAssetAuditLog(
  assetName,
  condition,
  zendeskTicketId,
  notes,
  action,
) {
  try {
    const url = `crf7f_ois_asset_audit_logs`;

    let body = {
      crf7f_name: assetName,
      crf7f_condition: condition,
      crf7f_zendesk_ticket_number: zendeskTicketId,
      crf7f_notes: notes,
      crf7f_action: action,
    };

    return await dataverseCall({ query: url, method: 'POST', body: body });
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
