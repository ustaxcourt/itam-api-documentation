import { app } from '@azure/functions';
import { buildResponse } from './buildResponse.js';
import { getJobTitleInfo } from '../useCases/getJobTitleInfo.js';
import { BadRequest } from '../errors/BadRequest.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function jobTitleHandler(request, context) {
  try {
    const jobTitleId = request.params.jobTitleID;

    if (!jobTitleId) {
      throw new BadRequest('Missing JobTitle ID');
    }

    if (request.method === 'GET') {
      var data = await getJobTitleInfo(jobTitleId);
    } else {
      throw new BadRequest('Invalid REST Method');
    }

    return buildResponse(200, 'Successfully queried jobTitle', data);
  } catch (error) {
    context.error(
      'Unable to update assignments',
      error.response?.data || error.message,
    );

    if (error instanceof BadRequest) {
      return buildResponse(error.statusCode, error.message);
    }

    if (error instanceof NotFoundError) {
      return buildResponse(404, error.message);
    }
  }
}

app.http('jobTitle', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'v1/titleInfo/{jobTitleID}',
  handler: jobTitleHandler,
});
