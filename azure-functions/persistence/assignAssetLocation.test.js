import { assignLocationAsset } from './assignAssetLocation.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./dataverseCall.js');

describe('assignLocationAsset', () => {
  const DATAVERSE_URL = 'https://example.com';
  const assetId = 'asset123';
  const locationId = 'location456';

  beforeEach(() => {
    process.env.DATAVERSE_URL = DATAVERSE_URL;
    jest.resetAllMocks();
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue({ success: true });

    const result = await assignLocationAsset(assetId, locationId);

    expect(dataverseCall).toHaveBeenCalledWith({
      body: {
        'crf7f_fac_asset_ref_locationLookup@odata.bind':
          'crf7f_fac_asset_ref_locations(location456)',
      },
      method: 'PATCH',
      query: 'crf7f_ois_asset_rela_item_orgs(asset123)',
    });
    expect(result).toEqual({ success: true });
  });

  it('should rethrow InternalServerError if caught', async () => {
    dataverseCall.mockRejectedValue(new InternalServerError('Server issue'));

    await expect(assignLocationAsset(assetId, locationId)).rejects.toThrow(
      InternalServerError,
    );
  });

  it('should rethrow DataverseTokenError if caught', async () => {
    dataverseCall.mockRejectedValue(new DataverseTokenError('Token expired'));

    await expect(assignLocationAsset(assetId, locationId)).rejects.toThrow(
      DataverseTokenError,
    );
  });

  it('should throw InternalServerError when an unknown error occurs', async () => {
    dataverseCall.mockRejectedValue(
      new Error('The problem is not with dataverseCall but this function'),
    );

    await expect(
      assignLocationAsset('badassetId', 'badLocationId'),
    ).rejects.toThrow(InternalServerError);
  });
});
