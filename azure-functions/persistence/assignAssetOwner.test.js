import { assignAssetOwner } from './assignAssetOwner.js';
import { getUserById } from './getUserById.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./getUserById.js');
jest.mock('./dataverseCall.js');

describe('assignAssetOwner', () => {
  const originalEnv = process.env.DATAVERSE_URL;

  beforeAll(() => {
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url';
  });

  afterAll(() => {
    process.env.DATAVERSE_URL = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    getUserById.mockResolvedValue('row-123');
    dataverseCall.mockResolvedValue({ status: 204 });

    const userId = 'user456';
    const assetId = 'asset789';

    const result = await assignAssetOwner(userId, assetId);

    const expectedUrl = `https://fake.dataverse.url/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
    const expectedBody = {
      'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': `crf7f_ois_asset_entra_dat_users(row-123)`,
      crf7f_asset_item_status: 0,
    };

    expect(getUserById).toHaveBeenCalledWith(userId);
    expect(dataverseCall).toHaveBeenCalledWith(
      expectedUrl,
      'PATCH',
      expectedBody,
    );
    expect(result.status).toBe(204);
  });

  it('should propagate errors from dataverseCall', async () => {
    getUserById.mockResolvedValue('row-123');
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(assignAssetOwner('user456', 'asset789')).rejects.toThrow(
      'Network failure',
    );
  });

  it('should handle missing DATAVERSE_URL gracefully', async () => {
    process.env.DATAVERSE_URL = undefined;
    getUserById.mockResolvedValue('row-123');

    await expect(assignAssetOwner('user456', 'asset789')).rejects.toThrow();
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url'; // restores for other tests
  });
});
