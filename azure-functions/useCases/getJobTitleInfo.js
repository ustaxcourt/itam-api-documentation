import { getDataverseJobTitle } from '../persistence/getDataverseJobTitle.js';

//asset arrays of zero length are handled at the controller level
export async function getJobTitleInfo(jobTitleId) {
  return await getDataverseJobTitle(jobTitleId);
}
