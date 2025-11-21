import { assignLocationAsset } from './assignAssetLocation.js';
import { dataverseCall } from './dataverseCall.js';
import { AppError } from '../errors/error.js';

jest.mock('./dataverseCall.js');

describe('assignLocationAsset', () => {
  const DATAVERSE_URL = 'https://example.com';
  const assetId = 'asset123';
  const locationId = 'location456';

  beforeEach(() => {
    process.env.DATAVERSE_URL = DATAVERSE_URL;
    jest.clearAllMocks();
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue({ success: true });

    const result = await assignLocationAsset(assetId, locationId);

    expect(dataverseCall).toHaveBeenCalledWith(
      `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`,
      'PATCH',
      {
        'crf7f_fac_asset_ref_locationLookup@odata.bind': `crf7f_fac_asset_ref_locations(${locationId})`,
      },
    );
    expect(result).toEqual({ success: true });
  });

  it('should throw AppError when error does not have passUp property', async () => {
    dataverseCall.mockRejectedValue(
      new AppError(404, 'Unable to retreive from internal database'),
    );

    await expect(assignLocationAsset(assetId, locationId)).rejects.toThrow(
      AppError,
    );
    await expect(assignLocationAsset(assetId, locationId)).rejects.toThrow(
      'Unable to retreive from internal database',
    );
  });

  it('should rethrow error when error has passUp property', async () => {
    const error = new Error('Pass up error');
    error.passUp = true;
    dataverseCall.mockRejectedValue(error);

    await expect(assignLocationAsset(assetId, locationId)).rejects.toThrow(
      error,
    );
  });
});
