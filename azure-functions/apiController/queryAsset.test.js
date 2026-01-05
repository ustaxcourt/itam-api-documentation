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

  // Replaces the old 500 test suite because it was relying on AxiosFetch returning a response property
  it('returns 500 for unexpected errors', async () => {
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
      data: null,
    });
  });
});
