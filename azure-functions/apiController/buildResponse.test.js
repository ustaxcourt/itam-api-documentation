import { buildResponse } from './buildResponse.js';

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

  it('should handle undefined data explicitly', () => {
    const result = buildResponse(201, 'Created', undefined);

    expect(result).toEqual({
      status: 201,
      jsonBody: {
        message: 'Created',
        data: null,
      },
    });
  });
});
