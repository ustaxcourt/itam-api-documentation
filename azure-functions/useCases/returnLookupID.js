import { dataverseCall } from '../persistence/dataverseCall.js';

export async function getId(table, column, value) {
  const url = `${table}?$filter=${column} eq '${value}'`;
  const response = await dataverseCall({ query: url, method: 'GET' });
  //console.log(response);
  let notpural = table.slice(0, -1);
  return response['value'][0][`${notpural}id`];
}
