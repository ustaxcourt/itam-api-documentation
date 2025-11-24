import { assignAssetOwner } from './assignAssetOwner.js';
import { getUserById } from './getUserById.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./getUserById.js');
jest.mock('./dataverseCall.js');

describe('assignAssetOwner', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    getUserById.mockResolvedValue('row-123');
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue({ status: 204 });

    const userId = 'user456';
    const assetId = 'asset789';

    const result = await assignAssetOwner(userId, assetId);

    const expectedQuery = `crf7f_ois_asset_rela_item_orgs(${assetId})`;
    const expectedBody = {
      'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': `crf7f_ois_asset_entra_dat_users(row-123)`,
      crf7f_asset_item_status: 0,
    };

    expect(getUserById).toHaveBeenCalledWith(userId);
    expect(dataverseCall).toHaveBeenCalledWith({
      query: expectedQuery,
      method: 'PATCH',
      body: expectedBody,
    });
    expect(result.status).toBe(204);
  });

  it('should propagate errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(assignAssetOwner('user456', 'asset789')).rejects.toThrow(
      new Error('Network failure'),
    );
  });
});
