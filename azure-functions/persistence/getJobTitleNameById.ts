import { dataverseCall } from './dataverseCall.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

//Even though this function returns a single asset, Dataverse responds with an array
type DataverseResponse<T> = {
  value?: T[];
};

type JobTitleRow = { crf7f_title?: string };

export async function getJobTitleNameById(id: string): Promise<string> {
  // Build Dataverse query URL

  const query = `crf7f_ois_job_titles?$select=crf7f_title&$filter=crf7f_ois_job_titleid eq '${id}'`;

  // Dataverse call
  const response = (await dataverseCall({
    query,
    method: 'GET',
  })) as DataverseResponse<JobTitleRow>;

  // Check to see if we got anything
  if (!response?.value || response.value.length === 0) {
    throw new NotFoundError('Resource not found');
  }

  if (!response.value[0].crf7f_title) {
    throw new InternalServerError('Invalid response from Dataverse');
  }

  return response.value[0].crf7f_title;
}
