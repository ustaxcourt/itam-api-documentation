import { decommission } from './decommission.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./dataverseCall.js');

describe('decommission', () => {
  const assetId = 'asset-guid-123';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls dataverseCall with correct PATCH query and payload', async () => {
    dataverseCall.mockResolvedValue(null);

    await decommission(assetId);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      query: `crf7f_ois_assetses(${assetId})`,
      method: 'PATCH',
      body: {
        crf7f_decommissioned: true,
      },
    });
  });

  it('returns the result from dataverseCall', async () => {
    dataverseCall.mockResolvedValue({ success: true });

    const result = await decommission(assetId);

    expect(result).toEqual({ success: true });
  });

  it('propagates errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Dataverse failure'));

    await expect(decommission(assetId)).rejects.toThrow('Dataverse failure');
  });
});
