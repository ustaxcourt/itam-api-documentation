import { getRequirementsForJobTitleRequestHandler } from './getRequirementsForJobTitleRequestHandler.js';
import { getJobTitleRequirementsInteractor } from '../useCases/getJobTitleRequirementsInteractor.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('../useCases/getJobTitleRequirementsInteractor.js');

describe('jobTitleHandler', () => {
  const context = { error: jest.fn(), log: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and job title info when found', async () => {
    const mockData = {
      jobTitle: 'Administrative Specialist',
      requiredAssets: [
        {
          assetType: 'Desk Clamp Power Strip',
          minimumQuantity: 1,
          maximumQuantity: 1,
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
              modelMinimum: 1,
            },
            {
              modelName: '22U Open Framer Server Rack',
              modelMaximum: 1,
              modelMinimum: 0,
            },
          ],
        },
      ],
    };

    getJobTitleRequirementsInteractor.mockResolvedValue(mockData);

    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await getRequirementsForJobTitleRequestHandler(
      request,
      context,
    );

    expect(getJobTitleRequirementsInteractor).toHaveBeenCalledWith('title123');
    expect(context.error).not.toHaveBeenCalled();
    expect(result.jsonBody.message).toBe('Success');
    expect(result.jsonBody.data).toBe(mockData);
    expect(result.status).toBe(200);
  });

  it('should return 400 when jobTitleID is missing', async () => {
    const error = new BadRequest('Missing Job title ID');

    const request = { params: {}, method: 'GET' };
    const result = await getRequirementsForJobTitleRequestHandler(
      request,
      context,
    );
    expect(context.error).toHaveBeenCalledWith(
      'Unable to query job title',
      error.message,
    );
    expect(result.jsonBody.message).toBe('Missing Job title ID');
    expect(result.status).toBe(400);
  });

  it('should return 400 for invalid REST method', async () => {
    const error = new BadRequest('Invalid REST Method');
    getJobTitleRequirementsInteractor.mockRejectedValue(error);

    const request = { params: { jobTitleID: 'title123' }, method: 'POST' };
    const result = await getRequirementsForJobTitleRequestHandler(
      request,
      context,
    );
    expect(context.error).toHaveBeenCalledWith(
      'Unable to query job title',
      error.message,
    );
    expect(result.jsonBody.message).toBe('Invalid REST Method');
    expect(result.status).toBe(400);
  });

  it('should return 404 when NotFoundError is thrown', async () => {
    const error = new NotFoundError('No job title found for ID: title123');
    getJobTitleRequirementsInteractor.mockRejectedValue(error);

    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await getRequirementsForJobTitleRequestHandler(
      request,
      context,
    );
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
    getJobTitleRequirementsInteractor.mockRejectedValue(error);
    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await getRequirementsForJobTitleRequestHandler(
      request,
      context,
    );

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
