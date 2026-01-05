import { getJobTitleRequirementsById } from '../persistence/getJobTitleRequirementsById.js';
import { getJobTitleNameById } from '../persistence/getJobTitleNameById.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { AssetRequirement } from '../persistence/restructureJobTitleRequirements.js';

export type JobTitleRequirementsResult = {
  jobTitle: string;
  requiredAssets: AssetRequirement[];
};

//asset arrays of zero length are handled at the controller level

export async function getJobTitleRequirementsInteractor(
  jobTitleId: string,
): Promise<JobTitleRequirementsResult> {
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
