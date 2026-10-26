import { recommission } from './recommission.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./dataverseCall.js');

describe('recommission', () => {
  const assetId = 'asset-guid-123';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls dataverseCall with correct PATCH query and payload', async () => {
    dataverseCall.mockResolvedValue(null);

    await recommission(assetId);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      query: `crf7f_ois_assetses(${assetId})`,
      method: 'PATCH',
      body: {
        crf7f_decommissioned: false,
      },
    });
  });

  it('returns the result from dataverseCall', async () => {
    dataverseCall.mockResolvedValue({ success: true });

    const result = await recommission(assetId);

    expect(result).toEqual({ success: true });
  });

  it('propagates errors thrown by dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Dataverse PATCH failed'));

    await expect(recommission(assetId)).rejects.toThrow(
      'Dataverse PATCH failed',
    );
  });
});
