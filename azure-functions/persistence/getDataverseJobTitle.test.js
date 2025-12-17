import { getDataverseJobTitle } from './getDataverseJobTitle.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('./dataverseCall.js');

describe('getDataverseJobTitle', () => {
  const jobTitleId = 'b09cf686-30d5-f011-8544-7c1e52177972';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue({ success: true, value: true });
    const result = await getDataverseJobTitle(jobTitleId);

    expect(dataverseCall).toHaveBeenCalledWith({
      query: `crf7f_ois_job_title_model_types?$select=crf7f_modelmaximum,crf7f_JobTitleAssetType,crf7f_ReferenceModel&$filter=crf7f_JobTitleAssetType/crf7f_JobTitle/crf7f_ois_job_titleid eq '${jobTitleId}'&$expand=crf7f_ReferenceModel($select=crf7f_name),crf7f_JobTitleAssetType($select=crf7f_minimumquanitity,crf7f_maximumquantity,crf7f_JobTitle,crf7f_AssetType;$expand=crf7f_JobTitle($select=crf7f_title),crf7f_AssetType($select=crf7f_name))`,
      method: 'GET',
    });
    expect(result).toEqual({ success: true, value: true });
  });

  it('should throw NotFoundError when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getDataverseJobTitle('job-title-123')).rejects.toThrow(
      NotFoundError,
    );
    await expect(getDataverseJobTitle('job-title-123')).rejects.toThrow(
      'Resource not found',
    );
  });

  it('should throw NotFoundError when response is null', async () => {
    dataverseCall.mockResolvedValue(null);

    await expect(getDataverseJobTitle('job-title-123')).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should propagate errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(getDataverseJobTitle('job-title-123')).rejects.toThrow(
      'Network failure',
    );
  });
});
