import { queryAssetHandler } from './queryAsset.js';
import { buildResponse } from './buildResponse.js';
import { getAssetDetails } from '../useCases/getAssetDetails.js';

jest.mock('./buildResponse.js');
jest.mock('../useCases/getAssetDetails.js');

describe('queryAssetHandler', () => {
  const context = { error: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and asset details when found', async () => {
    const mockData = { id: 'asset123', name: 'Laptop' };
    getAssetDetails.mockResolvedValue(mockData);
    buildResponse.mockReturnValue({
      status: 200,
      jsonBody: { message: 'Success', data: mockData },
    });

    const request = { params: { itemid: 'asset123' } };
    const result = await queryAssetHandler(request, context);

    expect(getAssetDetails).toHaveBeenCalledWith('asset123');
    expect(buildResponse).toHaveBeenCalledWith(200, 'Success', mockData);
    expect(result.status).toBe(200);
  });

  it('should return 404 when asset details are empty', async () => {
    getAssetDetails.mockResolvedValue({});
    buildResponse.mockReturnValue({
      status: 404,
      jsonBody: { message: 'Dataverse query failed' },
    });

    const request = { params: { itemid: 'asset123' } };
    const result = await queryAssetHandler(request, context);

    expect(buildResponse).toHaveBeenCalledWith(404, 'Dataverse query failed');
    expect(result.status).toBe(404);
  });

  it('should handle errors with status from error.response', async () => {
    const error = { response: { status: 400 }, message: 'Bad Request' };
    getAssetDetails.mockRejectedValue(error);
    buildResponse.mockReturnValue({
      status: 400,
      jsonBody: { message: 'Dataverse query failed', data: 'Bad Request' },
    });

    const request = { params: { itemid: 'asset123' } };
    const result = await queryAssetHandler(request, context);

    expect(context.error).toHaveBeenCalledWith(
      'Dataverse query error:',
      'Bad Request',
    );
    expect(buildResponse).toHaveBeenCalledWith(
      400,
      'Dataverse query failed',
      'Bad Request',
    );
    expect(result.status).toBe(400);
  });

  it('should default to 500 when error.response is missing', async () => {
    const error = new Error('Network failure');
    getAssetDetails.mockRejectedValue(error);
    buildResponse.mockReturnValue({
      status: 500,
      jsonBody: { message: 'Dataverse query failed', data: 'Network failure' },
    });

    const request = { params: { itemid: 'asset123' } };
    const result = await queryAssetHandler(request, context);

    expect(context.error).toHaveBeenCalledWith(
      'Dataverse query error:',
      'Network failure',
    );
    expect(buildResponse).toHaveBeenCalledWith(
      500,
      'Dataverse query failed',
      'Network failure',
    );
    expect(result.status).toBe(500);
  });
});
