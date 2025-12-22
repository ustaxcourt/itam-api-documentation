import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { restructureJobTitleRequirements } from './restructureJobTitleRequirements.js';
import { parseDataverseResponse } from './parseDataverseResponse.js';

export async function getJobTitleRequirementsById(id) {
  // Build Dataverse query URL

  const query = `crf7f_ois_job_title_model_types?$select=crf7f_modelmaximum,crf7f_modelminimum,crf7f_JobTitleAssetType,crf7f_ReferenceModel&$filter=crf7f_JobTitleAssetType/crf7f_JobTitle/crf7f_ois_job_titleid eq '${id}'&$expand=crf7f_ReferenceModel($select=crf7f_name),crf7f_JobTitleAssetType($select=crf7f_minimumquanitity,crf7f_maximumquantity,crf7f_JobTitle,crf7f_AssetType;$expand=crf7f_JobTitle($select=crf7f_title),crf7f_AssetType($select=crf7f_name))`;

  // Dataverse call
  const response = await dataverseCall({ query: query, method: 'GET' });

  // Check to see if we got anything
  if (!response?.value || response.value.length === 0) {
    throw new NotFoundError(`Resource not found`);
  }

  const schema = {
    modelName: 'crf7f_ReferenceModel.crf7f_name',
    minimumQuantity: 'crf7f_JobTitleAssetType.crf7f_minimumquanitity',
    maximumQuantity: 'crf7f_JobTitleAssetType.crf7f_maximumquantity',
    assetType: 'crf7f_JobTitleAssetType.crf7f_AssetType.crf7f_name',
    modelMaximum: 'crf7f_modelmaximum',
    modelMinimum: 'crf7f_modelminimum', // TODO: this may need implementation in the database
  };

  return restructureJobTitleRequirements(
    response.value.map(row => parseDataverseResponse({ data: row, schema })),
  );
}
