import { dataverseCall } from './dataverseCall.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function getJobTitleNameById(id) {
  // Build Dataverse query URL

  const query = `crf7f_ois_job_titles?$select=crf7f_title&$filter=crf7f_ois_job_titleid eq '${id}'`;

  // Dataverse call
  const response = await dataverseCall({ query, method: 'GET' });

  // Check to see if we got anything
  if (!response?.value || response.value.length === 0) {
    throw new NotFoundError('Resource not found');
  }

  if (!response.value[0].crf7f_title) {
    throw new InternalServerError('Invalid response from Dataverse');
  }

  return response.value[0].crf7f_title;
}
