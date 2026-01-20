import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { restructureDataverseChoiceResponse } from './restructureDataverseChoiceResponse.js';

export async function getChoiceFieldIntegersFromAssetAuditLogTable() {
  const query = `EntityDefinitions(LogicalName='crf7f_ois_asset_audit_log')/Attributes(LogicalName='crf7f_condition')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$expand=OptionSet`;

  const response = await dataverseCall({ query, method: 'GET' });

  const options = response?.OptionSet?.Options;
  if (!Array.isArray(options) || options.length === 0) {
    throw new NotFoundError('No choice field found for asset audit log table');
  }

  return restructureDataverseChoiceResponse(options);
}
