import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { getJobTitleInfo } from '../useCases/getJobTitleInfo.js';
import { BadRequest } from '../errors/BadRequest.js';

export async function jobTitleHandler(request, context) {
  try {
    const jobTitleId = request.params.jobTitleID;

    if (!jobTitleId) {
      throw new BadRequest('Missing Job title ID');
    }

    if (request.method === 'GET') {
      var data = await getJobTitleInfo(jobTitleId);
    } else {
      throw new BadRequest('Invalid REST Method');
    }

    return buildResponse(200, 'Success', data);
  } catch (error) {
    context.error(
      'Unable to query job title',
      error.response?.data || error.message,
    );
    return buildResponse(error.statusCode, error.message);
  }
}

app.http('jobTitle', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/titleInfo/{jobTitleID}',
  handler: jobTitleHandler,
});
