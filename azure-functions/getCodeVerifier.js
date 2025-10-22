import { TableClient } from '@azure/data-tables';

const tableClient = TableClient.fromConnectionString(process.env.AzureWebJobsStorage, process.env.TABLE_NAME);

export async function getCodeVerifier(state) {
  try {
    const entity = await tableClient.getEntity('PKCE', state);
    return entity.codeVerifier;
  } catch (error) {
    console.error(`Failed to retrieve code verifier for state ${state}:`, error.message);
    return null; // or throw a custom error
  }
}
