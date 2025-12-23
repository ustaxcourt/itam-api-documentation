import { jobTitleHandler } from './queryJobTitleInfo';
import { getJobTitleInfo } from '../useCases/getJobTitleInfo';
import { BadRequest } from '../errors/BadRequest';
import { NotFoundError } from '../errors/NotFoundError';
import { InternalServerError } from '../errors/InternalServerError';

jest.mock('../useCases/getJobTitleInfo.js');

describe('jobTitleHandler', () => {
  const context = { error: jest.fn(), log: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and job title info when found', async () => {
    const mockData = {
      'Administrative Specialist': {
        requiredItems: [
          {
            assetType: 'Desk Clamp Power Strip',
            minimumQuantity: 1,
            maximumQuantity: 1,
            Items: [
              {
                itemName: 'CM568',
                itemMaximum: 3,
              },
            ],
          },
          {
            assetType: 'Laptop',
            minimumQuantity: 3,
            maximumQuantity: 2,
            Items: [
              {
                itemName: '727pm',
                itemMaximum: 2,
              },
              {
                itemName: '22U Open Framer Server Rack',
                itemMaximum: 1,
              },
            ],
          },
        ],
      },
    };

    getJobTitleInfo.mockResolvedValue(mockData);

    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await jobTitleHandler(request, context);

    expect(getJobTitleInfo).toHaveBeenCalledWith('title123');
    expect(context.error).not.toHaveBeenCalled();
    expect(result.jsonBody.message).toBe('Success');
    expect(result.jsonBody.data).toBe(mockData);
    expect(result.status).toBe(200);
  });

  it('should return 400 when jobTitleID is missing', async () => {
    const error = new BadRequest('Missing Job title ID');

    const request = { params: {}, method: 'GET' };
    const result = await jobTitleHandler(request, context);
    expect(context.error).toHaveBeenCalledWith(
      'Unable to query job title',
      error.message,
    );
    expect(result.jsonBody.message).toBe('Missing Job title ID');
    expect(result.status).toBe(400);
  });

  it('should return 400 for invalid REST method', async () => {
    const error = new BadRequest('Invalid REST Method');
    getJobTitleInfo.mockRejectedValue(error);

    const request = { params: { jobTitleID: 'title123' }, method: 'POST' };
    const result = await jobTitleHandler(request, context);
    expect(context.error).toHaveBeenCalledWith(
      'Unable to query job title',
      error.message,
    );
    expect(result.jsonBody.message).toBe('Invalid REST Method');
    expect(result.status).toBe(400);
  });

  it('should return 404 when NotFoundError is thrown', async () => {
    const error = new NotFoundError('No job title found for ID: title123');
    getJobTitleInfo.mockRejectedValue(error);

    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await jobTitleHandler(request, context);
    expect(context.error).toHaveBeenCalledWith(
      'Unable to query job title',
      error.message,
    );

    expect(result.jsonBody.message).toBe(
      `No job title found for ID: ${request.params.jobTitleID}`,
    );
    expect(result.status).toBe(404);
  });

  it('should return 500 for unexpected errors', async () => {
    const error = new InternalServerError(
      'Unable to get Job Title Item Requirements',
    );
    getJobTitleInfo.mockRejectedValue(error);
    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await jobTitleHandler(request, context);

    expect(context.error).toHaveBeenCalledWith(
      'Unable to query job title',
      error.message,
    );
    expect(result.jsonBody.message).toBe(
      `Unable to get Job Title Item Requirements`,
    );
    expect(result.status).toBe(500);
  });
});
