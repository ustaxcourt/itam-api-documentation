import { AppError } from '../errors/error.js';
import { dataverseCall } from '../persistence/dataverseCall.js';

export async function getId(table, column, value) {
  try {
    const { DATAVERSE_URL } = process.env;
    const url = `${DATAVERSE_URL}/api/data/v9.2/${table}?$filter=${column} eq '${value}'`;
    const response = await dataverseCall(url, 'GET');
    let notpural = table.slice(0, -1);
    return response.data.value[0][`${notpural}id`];
  } catch (error) {
    if (error.passUp) {
      throw error;
    } else {
      throw new AppError(404, 'ID not found', true);
    }
  }
}
