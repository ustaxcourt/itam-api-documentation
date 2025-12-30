import { buildResponse } from './buildResponse';

describe('buildResponse', () => {
  it('should return correct response with all parameters', () => {
    const result = buildResponse(200, 'Success', { id: '123' });

    expect(result).toEqual({
      status: 200,
      jsonBody: {
        message: 'Success',
        data: { id: '123' },
      },
    });
  });

  it('should return correct structure for 401 Unauthorized', () => {
    const result = buildResponse(401, 'Unauthorized');

    expect(result).toEqual({
      status: 401,
      jsonBody: {
        message: 'Unauthorized',
        data: null,
      },
    });
  });

  it('should return correct structure for 403 Forbidden', () => {
    const result = buildResponse(403, 'Forbidden');

    expect(result).toEqual({
      status: 403,
      jsonBody: {
        message: 'Forbidden',
        data: null,
      },
    });
  });

  it('should return null data when not provided', () => {
    const result = buildResponse(404, 'Not Found');

    expect(result).toEqual({
      status: 404,
      jsonBody: {
        message: 'Not Found',
        data: null,
      },
    });
  });

  it('should handle empty message gracefully', () => {
    const result = buildResponse(500, '');

    expect(result).toEqual({
      status: 500,
      jsonBody: {
        message: '',
        data: null,
      },
    });
  });
});
