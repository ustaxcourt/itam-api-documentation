import { assignLocationAsset } from './assignAssetLocation.js';
import { dataverseCall } from './dataverseCall.js';

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
});
