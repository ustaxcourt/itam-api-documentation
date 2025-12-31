import { getJobTitleDefaultRequirements } from './getJobTitleDefaultRequirements.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import {
  mockDataverseResponseItem,
  mockDataverseResponseList,
} from '../tests/mocks/mockJobTitleRequirements.js';

jest.mock('./dataverseCall.js');

describe('getJobTitleDefaultRequirements', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue(mockDataverseResponseItem);

    const result = await getJobTitleDefaultRequirements();

    expect(dataverseCall).toHaveBeenCalledWith({
      query: `crf7f_ois_job_title_model_types?$select=crf7f_modelmaximum,crf7f_modelminimum,crf7f_JobTitleAssetType,crf7f_ReferenceModel&$filter=crf7f_JobTitleAssetType/crf7f_isdefault eq true &$expand=crf7f_ReferenceModel($select=crf7f_name),crf7f_JobTitleAssetType($select=crf7f_minimumquanitity,crf7f_maximumquantity,crf7f_JobTitle,crf7f_AssetType;$expand=crf7f_JobTitle($select=crf7f_title),crf7f_AssetType($select=crf7f_name))`,
      method: 'GET',
    });

    expect(result).toEqual([
      {
        minimumQuantity: 3,
        maximumQuantity: 2,
        assetType: 'Laptop',
        models: [
          {
            modelName: '22U Open Framer Server Rack',
            modelMaximum: 1,
            modelMinimum: 0,
          },
        ],
      },
    ]);
  });

  it('should return the proper response when job title has more than one model under the same asset type', async () => {
    dataverseCall.mockResolvedValue(mockDataverseResponseList);

    const result = await getJobTitleDefaultRequirements();

    expect(dataverseCall).toHaveBeenCalledWith({
      query: `crf7f_ois_job_title_model_types?$select=crf7f_modelmaximum,crf7f_modelminimum,crf7f_JobTitleAssetType,crf7f_ReferenceModel&$filter=crf7f_JobTitleAssetType/crf7f_isdefault eq true &$expand=crf7f_ReferenceModel($select=crf7f_name),crf7f_JobTitleAssetType($select=crf7f_minimumquanitity,crf7f_maximumquantity,crf7f_JobTitle,crf7f_AssetType;$expand=crf7f_JobTitle($select=crf7f_title),crf7f_AssetType($select=crf7f_name))`,
      method: 'GET',
    });

    expect(result).toEqual([
      {
        assetType: 'Docking Station',
        minimumQuantity: 4,
        maximumQuantity: 8,
        models: [
          {
            modelName: 'CM568',
            modelMaximum: 3,
            modelMinimum: 3,
          },
        ],
      },
      {
        assetType: 'Laptop',
        minimumQuantity: 3,
        maximumQuantity: 2,
        models: [
          {
            modelName: '727pm',
            modelMaximum: 2,
            modelMinimum: 2,
          },
          {
            modelName: '22U Open Framer Server Rack',
            modelMaximum: 1,
            modelMinimum: 1,
          },
        ],
      },
    ]);
  });

  it('should throw NotFoundError when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getJobTitleDefaultRequirements()).rejects.toThrow(
      NotFoundError,
    );
    await expect(getJobTitleDefaultRequirements()).rejects.toThrow(
      'Resource not found',
    );
  });

  it('should throw NotFoundError when response is null', async () => {
    dataverseCall.mockResolvedValue(null);

    await expect(getJobTitleDefaultRequirements()).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should propagate errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(getJobTitleDefaultRequirements()).rejects.toThrow(
      'Network failure',
    );
  });
});
