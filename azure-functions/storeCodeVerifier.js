import { TableClient } from '@azure/data-tables';

const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, 'PKCEState');

export async function storeCodeVerifier(state, codeVerifier) {
  await tableClient.upsertEntity({
    partitionKey: 'PKCE',
    rowKey: state,
    codeVerifier,
    timestamp: new Date().toISOString()
  });
}
