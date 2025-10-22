import { TableClient } from '@azure/data-tables';

const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, process.env.TABLE_NAME);

export async function getCodeVerifier(state) {
  const entity = await tableClient.getEntity('PKCE', state);
  return entity.codeVerifier;
}
