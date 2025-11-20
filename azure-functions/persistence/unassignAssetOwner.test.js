import { unassignAssetOwner } from './unassignAssetOwner.js';
import { dataverseCall } from '../persistence/dataverseCall.js';

jest.mock('../persistence/dataverseCall.js');

describe('unassignAssetOwner', () => {
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
    dataverseCall.mockResolvedValue({}); // Mock success

    const assetId = 'asset123';
    await unassignAssetOwner(assetId);

    const expectedUrl = `https://fake.dataverse.url/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
    const expectedBody = {
      'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': null,
      crf7f_asset_item_status: 1,
    };

    expect(dataverseCall).toHaveBeenCalledWith(
      expectedUrl,
      'PATCH',
      expectedBody,
    );
  });

  it('should propagate errors from dataverseCall', async () => {
    const error = new Error('Network failure');
    dataverseCall.mockRejectedValue(error);

    await expect(unassignAssetOwner('asset123')).rejects.toThrow(
      'Network failure',
    );
  });
});
