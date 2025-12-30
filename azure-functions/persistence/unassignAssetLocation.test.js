import { unassignLocationAsset } from './unassignAssetLocation';
import { DataverseTokenError } from '../errors/DataverseTokenError';
import { InternalServerError } from '../errors/InternalServerError';
import { dataverseCall } from './dataverseCall';

jest.mock('./dataverseCall.js');

describe('unassignLocationAsset', () => {
  const DATAVERSE_URL = 'https://example.com';
  const assetId = 'asset123';
  let originalEnv;

  beforeAll(() => {
    originalEnv = process.env.DATAVERSE_URL;
  });

  beforeEach(() => {
    process.env.DATAVERSE_URL = DATAVERSE_URL;
    jest.resetAllMocks();
  });

  afterAll(() => {
    process.env.DATAVERSE_URL = originalEnv;
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue({ success: true });

    const result = await unassignLocationAsset(assetId);

    expect(dataverseCall).toHaveBeenCalledWith({
      body: {
        'crf7f_fac_asset_ref_locationLookup@odata.bind': null,
      },
      method: 'PATCH',
      query: 'crf7f_ois_asset_rela_item_orgs(asset123)',
    });
    expect(result).toEqual({ success: true });
  });

  it('should rethrow InternalServerError if caught', async () => {
    dataverseCall.mockRejectedValue(new InternalServerError('Server issue'));

    await expect(unassignLocationAsset(assetId)).rejects.toThrow(
      InternalServerError,
    );
  });

  it('should rethrow DataverseTokenError if caught', async () => {
    dataverseCall.mockRejectedValue(new DataverseTokenError('Token expired'));

    await expect(unassignLocationAsset(assetId)).rejects.toThrow(
      DataverseTokenError,
    );
  });

  it('should throw InternalServerError when an unknown error occurs', async () => {
    dataverseCall.mockRejectedValue(
      new Error('The problem is not with dataverseCall but this function'),
    );

    await expect(unassignLocationAsset('badassetId')).rejects.toThrow(
      InternalServerError,
    );
  });
});
