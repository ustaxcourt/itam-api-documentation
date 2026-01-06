import { getJobTitleRequirementsById } from '../persistence/getJobTitleRequirementsById';
import { getJobTitleNameById } from '../persistence/getJobTitleNameById';
import { InternalServerError } from '../errors/InternalServerError';
import { DataverseTokenError } from '../errors/DataverseTokenError';
import { NotFoundError } from '../errors/NotFoundError';

//asset arrays of zero length are handled at the controller level
export async function getJobTitleRequirementsInteractor(jobTitleId) {
  try {
    const jobTitleName = await getJobTitleNameById(jobTitleId);
    const requirements = await getJobTitleRequirementsById(jobTitleId);

    return {
      jobTitle: jobTitleName,
      requiredAssets: requirements,
    };
  } catch (error) {
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError ||
      error instanceof NotFoundError
    ) {
      console.error('Encountered error:', error.message);
      throw error;
    }

    console.error('Unkonwn error: ', error);
    throw new InternalServerError('Unable to get Job Title Item Requirements');
  }
}
