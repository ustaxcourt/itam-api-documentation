import { getDataverseJobTitle } from '../persistence/getDataverseJobTitle.js';
import { parseDataverseResponse } from '../persistence/parseDataverseResponse.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { restructureJobTitle } from '../persistence/restructureJobTitle.js';
import { NotFoundError } from '../errors/NotFoundError.js';

//asset arrays of zero length are handled at the controller level
export async function getJobTitleInfo(jobTitleId) {
  var response;
  var results;
  try {
    response = await getDataverseJobTitle(jobTitleId);

    let responseExpectation = {
      itemName: 'crf7f_ReferenceModel.crf7f_name',
      minimumQuantity: 'crf7f_JobTitleAssetType.crf7f_minimumquanitity',
      maximumQuantity: 'crf7f_JobTitleAssetType.crf7f_maximumquantity',
      jobTitle: 'crf7f_JobTitleAssetType.crf7f_JobTitle.crf7f_title',
      assetType: 'crf7f_JobTitleAssetType.crf7f_AssetType.crf7f_name',
      modelMaximum: 'crf7f_modelmaximum',
    };
    results = [];
    for (const item of response.value) {
      const result = await parseDataverseResponse(item, responseExpectation);
      results.push(result);
    }

    return await restructureJobTitle(results);
  } catch (error) {
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError ||
      error instanceof NotFoundError
    ) {
      console.error('Encountered error:', error.message);
      throw error;
    }

    throw new InternalServerError('Unable to get Job Title Item Requirements');
  }
}
