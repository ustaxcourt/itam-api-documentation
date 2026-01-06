import { queryAssetHandler } from './queryAsset';
import { getAssetDetails } from '../useCases/getAssetDetails';

jest.mock('../useCases/getAssetDetails.js');

describe('queryAssetHandler', () => {
  const context = { error: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 200 and asset details when found', async () => {
    const mockData = { id: 'asset123', name: 'Laptop' };
    getAssetDetails.mockResolvedValue(mockData);

    const request = { params: { itemid: 'asset123' } };
    const result = await queryAssetHandler(request, context);

    expect(getAssetDetails).toHaveBeenCalledWith('asset123');
    expect(result.status).toBe(200);
  });

  it('should return 404 when asset details are empty', async () => {
    getAssetDetails.mockResolvedValue({});

    const request = { params: { itemid: 'asset123' } };
    const result = await queryAssetHandler(request, context);

    expect(result.status).toBe(404);
    expect(result.jsonBody.message).toBe(
      `Asset ${request.params.itemid} not found`,
    );
  });

  it('should handle errors with status from error.response', async () => {
    const error = { response: { status: 400 }, message: 'Bad Request' };
    getAssetDetails.mockRejectedValue(error);
    const request = { params: { itemid: 'asset123' } };
    const result = await queryAssetHandler(request, context);

    expect(context.error).toHaveBeenCalledWith(
      'Dataverse query error:',
      'Bad Request',
    );
    expect(result.status).toBe(400);
    expect(result.jsonBody).toEqual({
      data: 'Bad Request',
      message: 'Dataverse query failed',
    });
  });

  it('should default to 500 when error.response is missing', async () => {
    const error = new Error('Network failure');
    getAssetDetails.mockRejectedValue(error);

    const request = { params: { itemid: 'asset123' } };
    const result = await queryAssetHandler(request, context);

    expect(context.error).toHaveBeenCalledWith(
      'Dataverse query error:',
      'Network failure',
    );
    expect(result.status).toBe(500);
    expect(result.jsonBody).toEqual({
      message: 'Dataverse query failed',
      data: 'Network failure',
    });
  });
});
