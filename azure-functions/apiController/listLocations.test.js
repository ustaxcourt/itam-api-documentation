import { listLocationsHandler } from './listLocations.js';
import { locationsWrapper } from '../useCases/locationsWrapper.js';
import { buildResponse } from './buildResponse.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { BadRequest } from '../errors/BadRequest.js';

jest.mock('../useCases/locationsWrapper.js');
jest.mock('./buildResponse.js', () => ({
  buildResponse: jest.fn((status, message, data = null) => ({
    status,
    jsonBody: {
      message,
      data,
    },
  })),
}));

describe('listLocationsHandler', () => {
  let context;

  beforeEach(() => {
    context = {
      error: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('successfully returns locations on GET', async () => {
    const mockLocations = [{ name: 'Location A' }, { name: 'Location B' }];

    locationsWrapper.mockResolvedValue(mockLocations);

    const request = {
      method: 'GET',
    };

    const result = await listLocationsHandler(request, context);

    expect(locationsWrapper).toHaveBeenCalledTimes(1);

    expect(buildResponse).toHaveBeenCalledWith(
      200,
      'Successfully retrieved locations',
      mockLocations,
    );

    expect(result).toEqual({
      status: 200,
      jsonBody: {
        message: 'Successfully retrieved locations',
        data: mockLocations,
      },
    });

    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 400 for invalid HTTP method', async () => {
    const request = {
      method: 'POST',
    };

    const result = await listLocationsHandler(request, context);

    expect(locationsWrapper).not.toHaveBeenCalled();

    expect(buildResponse).toHaveBeenCalledWith(400, 'Invalid REST Method');

    expect(result).toEqual({
      status: 400,
      jsonBody: {
        message: 'Invalid REST Method',
        data: null,
      },
    });

    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 404 when locationsWrapper throws NotFoundError', async () => {
    locationsWrapper.mockRejectedValue(new NotFoundError('No locations found'));

    const request = {
      method: 'GET',
    };

    const result = await listLocationsHandler(request, context);

    expect(locationsWrapper).toHaveBeenCalledTimes(1);

    expect(buildResponse).toHaveBeenCalledWith(404, 'No locations found');

    expect(result).toEqual({
      status: 404,
      jsonBody: {
        message: 'No locations found',
        data: null,
      },
    });

    expect(context.error).not.toHaveBeenCalled();
  });

  it('returns 400 when BadRequest is thrown', async () => {
    locationsWrapper.mockRejectedValue(new BadRequest('Invalid request'));

    const request = {
      method: 'GET',
    };

    const result = await listLocationsHandler(request, context);

    expect(buildResponse).toHaveBeenCalledWith(400, 'Invalid request');

    expect(result).toEqual({
      status: 400,
      jsonBody: {
        message: 'Invalid request',
        data: null,
      },
    });

    expect(context.error).not.toHaveBeenCalled();
  });

  it('logs error and returns internal error response for unexpected errors', async () => {
    const error = new Error('Unexpected failure');
    error.statusCode = 500;

    locationsWrapper.mockRejectedValue(error);

    const request = {
      method: 'GET',
    };

    const result = await listLocationsHandler(request, context);

    expect(locationsWrapper).toHaveBeenCalledTimes(1);

    expect(context.error).toHaveBeenCalledWith(
      'Unable to list locations',
      'Unexpected failure',
    );

    expect(buildResponse).toHaveBeenCalledWith(500, 'Unexpected failure');

    expect(result).toEqual({
      status: 500,
      jsonBody: {
        message: 'Unexpected failure',
        data: null,
      },
    });
  });

  it('uses fallback status/message when error lacks properties', async () => {
    const error = new Error();

    locationsWrapper.mockRejectedValue(error);

    const request = {
      method: 'GET',
    };

    const result = await listLocationsHandler(request, context);

    expect(buildResponse).toHaveBeenCalledWith(500, 'Internal Server Error');

    expect(result).toEqual({
      status: 500,
      jsonBody: {
        message: 'Internal Server Error',
        data: null,
      },
    });
  });
});
