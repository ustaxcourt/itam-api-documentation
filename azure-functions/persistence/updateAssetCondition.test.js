import { updateAssetCondition } from './updateAssetCondition.js';
import { dataverseCall } from './dataverseCall.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('./dataverseCall.js');

describe('updateAssetCondition', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should throw InternalServerError when assetId is missing', async () => {
    await expect(updateAssetCondition(undefined, 1)).rejects.toThrow(
      new InternalServerError('Missing assetId (record GUID)'),
    );
  });

  it('should throw InternalServerError when conditionCode is not a number', async () => {
    await expect(
      updateAssetCondition('00000000-0000-0000-0000-000000000000', 'bad'),
    ).rejects.toThrow(
      new InternalServerError(
        'Condition code for a Choice column must be a number',
      ),
    );
  });

  it('should call dataverseCall with PATCH, correct query, and body when inputs are valid', async () => {
    dataverseCall.mockResolvedValue(undefined);

    const assetId = '00000000-0000-0000-0000-000000000000';
    const conditionCode = 42;
    const expectedQuery = `crf7f_ois_asset_rela_item_orgs(${assetId})`;
    const result = await updateAssetCondition(assetId, conditionCode);

    expect(dataverseCall).toHaveBeenCalledWith({
      query: expectedQuery,
      method: 'PATCH',
      body: { crf7f_asset_item_condition: conditionCode },
    });
    // function returns void (undefined) on successful execution
    expect(result).toBeUndefined();
  });

  it('should propagate errors thrown by dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(
      updateAssetCondition('00000000-0000-0000-0000-000000000000', 1),
    ).rejects.toThrow(new Error('Network failure'));
  });
});
