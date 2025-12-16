import { getDataverseJobTitle } from '../persistence/getDataverseJobTitle.js';
import { reorderResponseObject } from '../persistence/reorderResponse.js';
import { restructureJobTitles } from '../persistence/restructureJobTitle.js';

//asset arrays of zero length are handled at the controller level
export async function getJobTitleInfo(jobTitleId) {
  var response;
  var results;
  response = await getDataverseJobTitle(jobTitleId);

  let responseexpect = {
    itemName: 'crf7f_ReferenceModel.crf7f_name',
    minimumQuantity: 'crf7f_JobTitleAssetType.crf7f_minimumquanitity',
    maximumQuantity: 'crf7f_JobTitleAssetType.crf7f_maximumquantity',
    jobTitle: 'crf7f_JobTitleAssetType.crf7f_JobTitle.crf7f_title',
    assetType: 'crf7f_JobTitleAssetType.crf7f_AssetType.crf7f_name',
    modelMaximum: 'crf7f_modelmaximum',
  };

  results = [];

  if (Array.isArray(response.value)) {
    for (const item of response.value) {
      const result = await reorderResponseObject(item, responseexpect);
      results.push(result);
    }
  } else {
    results = await reorderResponseObject(response.value[0], responseexpect);
  }

  //return results;
  return restructureJobTitles(results);
}
