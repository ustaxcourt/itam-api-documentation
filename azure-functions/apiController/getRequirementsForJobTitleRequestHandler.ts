import { app, HttpRequest, InvocationContext } from '@azure/functions';
import { ApiResponse, buildResponse } from './buildResponse.js';
import {
  getJobTitleRequirementsInteractor,
  JobTitleRequirementsResult,
} from '../useCases/getJobTitleRequirementsInteractor.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function getRequirementsForJobTitleRequestHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<ApiResponse<JobTitleRequirementsResult>> {
  try {
    const jobTitleId = request.params.jobTitleID;

    if (!jobTitleId) {
      throw new BadRequest('Missing Job title ID');
    }

    if (request.method !== 'GET') {
      throw new BadRequest('Invalid REST Method');
    }

    const data = await getJobTitleRequirementsInteractor(jobTitleId);
    return buildResponse(200, 'Success', data);
  } catch (error) {
    if (error instanceof BadRequest) {
      context.error('Bad request:', error.message);
      return buildResponse(400, error.message, null);
    }
    if (error instanceof NotFoundError) {
      context.error('Not found:', error.message);
      return buildResponse(404, error.message, null);
    }
    if (error instanceof Error) {
      context.error('Unable to query job title', error.message);
      return buildResponse(500, 'Unable to query job title', null);
    }
    context.error('Unknown error:', error);
    return buildResponse(500, 'Unable to query job title', null);
  }
}

app.http('jobTitle', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/job-titles/{jobTitleID}/requirements',
  handler: getRequirementsForJobTitleRequestHandler,
});
