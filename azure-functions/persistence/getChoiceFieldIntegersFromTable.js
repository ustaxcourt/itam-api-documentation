import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { restructureDataverseChoiceResponse } from './restructureDataverseChoiceResponse.js';

export async function getChoiceFieldIntegersFromTable(
  table,
  choiceFieldLogicalName,
) {
  const query = `EntityDefinitions(LogicalName='${table}')/Attributes(LogicalName='${choiceFieldLogicalName}')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$expand=OptionSet`;

  const response = await dataverseCall({ query: query, method: 'GET' });
  if (response.OptionSet.Options === 0) {
    throw new NotFoundError(
      `No choice field found for table: ${table}, ${choiceFieldLogicalName}`,
    );
  }

  return restructureDataverseChoiceResponse(response.OptionSet.Options);
}
