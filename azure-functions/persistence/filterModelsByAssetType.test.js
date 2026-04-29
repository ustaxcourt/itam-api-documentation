import { dataverseCall } from './dataverseCall';
import { filterModelsByAssetType } from './filterModelsByAssetType';
import { InternalServerError } from '../errors/InternalServerError';

jest.mock('./dataverseCall', () => ({
  dataverseCall: jest.fn(),
}));

describe('filterModelsByAssetType', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns model IDs for a given asset type ID', async () => {
    const assetTypeId = '11111111-2222-3333-4444-555555555555';
    const mockResponse = {
      value: [
        { crf7f_ois_asset_ref_modelid: 'model-1' },
        { crf7f_ois_asset_ref_modelid: 'model-2' },
      ],
    };

    dataverseCall.mockResolvedValue(mockResponse);

    const result = await filterModelsByAssetType(assetTypeId);
    expect(result).toEqual(['model-1', 'model-2']);
  });

  test('returns empty array if no models match the asset type ID', async () => {
    const assetTypeId = '11111111-2222-3333-4444-555555555555';
    const mockResponse = { value: [] };
    dataverseCall.mockResolvedValue(mockResponse);

    const result = await filterModelsByAssetType(assetTypeId);
    expect(result).toEqual([]);
  });

  test('handles dataverseCall throwing an internal server error', async () => {
    const assetTypeId = '11111111-2222-3333-4444-555555555555';
    dataverseCall.mockRejectedValue(new InternalServerError('Dataverse error'));

    await expect(filterModelsByAssetType(assetTypeId)).rejects.toThrow(
      InternalServerError,
    );
  });
});
