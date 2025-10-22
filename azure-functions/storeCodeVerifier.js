import { TableClient } from '@azure/data-tables';

const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, process.env.TABLE_NAME);

export async function storeCodeVerifier(state, codeVerifier) {
  await tableClient.upsertEntity({
    partitionKey: 'PKCE',
    rowKey: state,
    codeVerifier,
    timestamp: new Date().toISOString()
  });
}
