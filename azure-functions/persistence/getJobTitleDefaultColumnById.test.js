import { getJobTitleDefaultColumnById } from './getJobTitleDefaultColumnById.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('./dataverseCall.js');

describe('getJobTitleDefaultColumnById', () => {
  const jobTitleId = 'b09cf686-30d5-f011-8544-7c1e52177972';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue({
      value: [
        {
          crf7f_defaultassetrequirements: false,
        },
      ],
    });
    await getJobTitleDefaultColumnById(jobTitleId);

    expect(dataverseCall).toHaveBeenCalledWith({
      query:
        "crf7f_ois_job_titles?$select=crf7f_defaultassetrequirements&$filter=crf7f_ois_job_titleid eq 'b09cf686-30d5-f011-8544-7c1e52177972'",
      method: 'GET',
    });
  });

  it('should get the default column from the dataverse response and return it', async () => {
    dataverseCall.mockResolvedValue({
      value: [
        {
          crf7f_defaultassetrequirements: true,
        },
      ],
    });
    const result = await getJobTitleDefaultColumnById(jobTitleId);
    expect(result).toEqual(true);
  });

  it('should throw an InternalServerError if the response back from Dataverse is malformed', async () => {
    dataverseCall.mockResolvedValue({
      value: [
        {
          crf7f_this_is_a_fake_field: 'Title is missing, oh no!',
        },
      ],
    });

    await expect(getJobTitleDefaultColumnById(jobTitleId)).rejects.toThrow(
      InternalServerError,
    );
  });

  it('should throw NotFoundError when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getJobTitleDefaultColumnById('job-title-123')).rejects.toThrow(
      NotFoundError,
    );
    await expect(getJobTitleDefaultColumnById('job-title-123')).rejects.toThrow(
      'Resource not found',
    );
  });

  it('should throw NotFoundError when response is null', async () => {
    dataverseCall.mockResolvedValue(null);

    await expect(getJobTitleDefaultColumnById('job-title-123')).rejects.toThrow(
      NotFoundError,
    );
  });

  it('should propagate errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(getJobTitleDefaultColumnById('job-title-123')).rejects.toThrow(
      'Network failure',
    );
  });
});
