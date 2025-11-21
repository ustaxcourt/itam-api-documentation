import { dataverseCall } from '../persistence/dataverseCall.js';

export async function returnLookupID(table, column, value) {
  const { DATAVERSE_URL } = process.env;
  const url = `${DATAVERSE_URL}/api/data/v9.2/${table}?$filter=${column} eq '${value}'`;
  const response = await dataverseCall(url, 'GET');

  console.log(response.data.value[0]);

  let notpural = table.slice(0, -1);

  console.log(`${notpural}id`);

  return response.data.value[0][`${notpural}id`];
}
