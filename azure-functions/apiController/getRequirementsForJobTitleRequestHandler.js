import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { getJobTitleRequirementsInteractor } from '../useCases/getJobTitleRequirementsInteractor.js';
import { BadRequest } from '../errors/BadRequest.js';
import { patchAppHttp } from '../useCases/maintenanceMode.js';

export async function getRequirementsForJobTitleRequestHandler(
  request,
  context,
) {
  try {
    const jobTitleId = request.params.jobTitleID;

    if (!jobTitleId) {
      throw new BadRequest('Missing Job title ID');
    }

    if (request.method === 'GET') {
      const data = await getJobTitleRequirementsInteractor(jobTitleId);
      return buildResponse(200, 'Success', data);
    } else {
      throw new BadRequest('Invalid REST Method');
    }
  } catch (error) {
    context.error(
      'Unable to query job title',
      error.response?.data || error.message,
    );
    return buildResponse(error.statusCode, error.message);
  }
}

patchAppHttp(app);

app.http('jobTitle', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/job-titles/{jobTitleID}/requirements',
  handler: getRequirementsForJobTitleRequestHandler,
});
