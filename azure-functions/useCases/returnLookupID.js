import { NotFoundError } from '../errors/NotFoundError.js';
import { dataverseCall } from '../persistence/dataverseCall.js';

export async function getId({ table, column, value }) {
  const url = `${table}?$filter=${column} eq '${value}'`;
  const response = await dataverseCall({ query: url, method: 'GET' });
  let notpural = table.slice(0, -1);
  if (response['value'].length === 0) {
    throw new NotFoundError('Id not found');
  } else {
    return response['value'][0][`${notpural}id`];
  }
}
