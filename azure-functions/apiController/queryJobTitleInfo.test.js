import { jobTitleHandler } from './queryJobTitleInfo.js';
import { buildResponse } from './buildResponse.js';
import { getJobTitleInfo } from '../useCases/getJobTitleInfo.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('./buildResponse.js');
jest.mock('../useCases/getJobTitleInfo.js');

describe('jobTitleHandler', () => {
  const context = { error: jest.fn(), log: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and job title info when found', async () => {
    const mockData = { id: 'title123', name: 'O365 Engineer' };
    getJobTitleInfo.mockResolvedValue(mockData);
    buildResponse.mockReturnValue({
      status: 200,
      jsonBody: { message: 'Successfully queried job title', data: mockData },
    });

    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await jobTitleHandler(request, context);

    expect(getJobTitleInfo).toHaveBeenCalledWith('title123');
    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully queried job title',
      mockData,
    );
    expect(result.status).toBe(200);
  });

  it('should return 400 when jobTitleID is missing', async () => {
    const error = new BadRequest('Missing Job title ID');
    buildResponse.mockReturnValue({
      status: 400,
      jsonBody: { message: error.message },
    });

    const request = { params: {}, method: 'GET' };
    const result = await jobTitleHandler(request, context);

    expect(buildResponse).toHaveBeenCalledWith(400, 'Missing Job title ID');
    expect(result.status).toBe(400);
  });

  it('should return 400 for invalid REST method', async () => {
    const error = new BadRequest('Invalid REST Method');
    buildResponse.mockReturnValue({
      status: 400,
      jsonBody: { message: error.message },
    });

    const request = { params: { jobTitleID: 'title123' }, method: 'POST' };
    const result = await jobTitleHandler(request, context);

    expect(buildResponse).toHaveBeenCalledWith(400, 'Invalid REST Method');
    expect(result.status).toBe(400);
  });

  it('should return 404 when NotFoundError is thrown', async () => {
    const error = new NotFoundError('Job title not found');
    getJobTitleInfo.mockRejectedValue(error);
    buildResponse.mockReturnValue({
      status: 404,
      jsonBody: { message: error.message },
    });

    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await jobTitleHandler(request, context);

    expect(context.error).toHaveBeenCalledWith(
      'Unable to update assignments',
      error.message,
    );
    expect(buildResponse).toHaveBeenCalledWith(404, 'Job title not found');
    expect(result.status).toBe(404);
  });

  it('should return 500 for unexpected errors', async () => {
    const error = new Error('Database connection failed');
    getJobTitleInfo.mockRejectedValue(error);
    buildResponse.mockReturnValue({
      status: 500,
      jsonBody: { message: 'Internal Server Error' },
    });

    const request = { params: { jobTitleID: 'title123' }, method: 'GET' };
    const result = await jobTitleHandler(request, context);

    expect(context.error).toHaveBeenCalledWith(
      'Unable to update assignments',
      'Database connection failed',
    );
    expect(buildResponse).toHaveBeenCalledWith(500, 'Internal Server Error');
    expect(result.status).toBe(500);
  });
});
