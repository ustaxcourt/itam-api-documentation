import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { reorderResponseObject } from './reorderResponse.js';

export async function getDataverseJobTitle(id) {
  // Build Dataverse query URL

  const query = `crf7f_ois_job_title_model_types?$select=crf7f_JobTitleAssetType,crf7f_ReferenceModel&$filter= crf7f_JobTitleAssetType/crf7f_JobTitle/crf7f_ois_job_titleid eq '${id}'&$expand=crf7f_ReferenceModel($select = crf7f_name),crf7f_JobTitleAssetType($select=crf7f_minimumquanitity, crf7f_maximumquantity,crf7f_JobTitle,crf7f_AssetType;$expand=crf7f_JobTitle($select=crf7f_title ),crf7f_AssetType($select = crf7f_name))`;

  // Dataverse call

  const response = await dataverseCall({ query: query, method: 'GET' });
  if (!response?.value || response.value.length === 0) {
    throw new NotFoundError(`No jobtitleID found for ID: ${id}`);
  }

  // Normalize data

  let responseexpect = {
    ItemName: 'crf7f_ReferenceModel.crf7f_name',
    minimumquanitity: 'crf7f_JobTitleAssetType.crf7f_minimumquanitity',
    MaximumQuantity: 'crf7f_JobTitleAssetType.crf7f_maximumquantity',
    JobTitle: 'crf7f_JobTitleAssetType.crf7f_JobTitle.crf7f_title',
    AssetType: 'crf7f_JobTitleAssetType.crf7f_AssetType.crf7f_name',
  };

  const results = [];

  if (Array.isArray(response.value)) {
    for (const item of response.value) {
      const result = await reorderResponseObject(item, responseexpect);
      results.push(result);
    }
  } else {
    return await reorderResponseObject(response.value[0], responseexpect);
  }

  return results;
}
