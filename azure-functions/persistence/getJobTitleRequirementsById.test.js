import { getJobTitleRequirementsById } from './getJobTitleRequirementsById.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('./dataverseCall.js');

describe('getJobTitleRequirementsById', () => {
  const jobTitleId = 'b09cf686-30d5-f011-8544-7c1e52177972';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue({
      value: [
        {
          crf7f_JobTitleAssetType: {
            crf7f_minimumquanitity: 1,
            crf7f_maximumquantity: 2,
            crf7f_JobTitle: {
              crf7f_title: 'Job Title 1',
            },
            crf7f_AssetType: {
              crf7f_name: 'Asset Type 1',
            },
          },
          crf7f_modelmaximum: 1,
          crf7f_modelminimum: 0,
          crf7f_ReferenceModel: {
            crf7f_name: 'Reference Model 1',
          },
        },
      ],
    });
    const result = await getJobTitleRequirementsById(jobTitleId);

    expect(dataverseCall).toHaveBeenCalledWith({
      query: `crf7f_ois_job_title_model_types?$select=crf7f_modelmaximum,crf7f_JobTitleAssetType,crf7f_ReferenceModel&$filter=crf7f_JobTitleAssetType/crf7f_JobTitle/crf7f_ois_job_titleid eq '${jobTitleId}'&$expand=crf7f_ReferenceModel($select=crf7f_name),crf7f_JobTitleAssetType($select=crf7f_minimumquanitity,crf7f_maximumquantity,crf7f_JobTitle,crf7f_AssetType;$expand=crf7f_JobTitle($select=crf7f_title),crf7f_AssetType($select=crf7f_name))`,
      method: 'GET',
    });

    expect(result).toEqual([
      {
        minimumQuantity: 1,
        maximumQuantity: 2,
        assetType: 'Asset Type 1',
        models: [
          {
            modelName: 'Reference Model 1',
            modelMaximum: 1,
            modelMinimum: 0,
          },
        ],
      },
    ]);
  });

  it('should throw NotFoundError when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getJobTitleRequirementsById('job-title-123')).rejects.toThrow(
      NotFoundError,
    );
    await expect(getJobTitleRequirementsById('job-title-123')).rejects.toThrow(
      'Resource not found',
    );
  });

  it('should throw NotFoundError when response is null', async () => {
    dataverseCall.mockResolvedValue(null);

    await expect(getJobTitleRequirementsById('job-title-123')).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should propagate errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(getJobTitleRequirementsById('job-title-123')).rejects.toThrow(
      'Network failure',
    );
  });
});
