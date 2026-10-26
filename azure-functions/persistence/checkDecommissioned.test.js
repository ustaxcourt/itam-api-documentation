import { checkDecommissioned } from './checkDecommissioned.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./dataverseCall.js');

describe('checkDecommissioned', () => {
  const assetId = 'asset-guid-123';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('calls dataverseCall with the correct GET query', async () => {
    dataverseCall.mockResolvedValue({
      crf7f_decommissioned: false,
    });

    await checkDecommissioned(assetId);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      query: `crf7f_ois_assetses(${assetId})?$select=crf7f_decommissioned`,
      method: 'GET',
    });
  });

  it('returns true when crf7f_decommissioned is true', async () => {
    dataverseCall.mockResolvedValue({
      crf7f_decommissioned: true,
    });

    const result = await checkDecommissioned(assetId);

    expect(result).toBe(true);
  });

  it('returns false when crf7f_decommissioned is false', async () => {
    dataverseCall.mockResolvedValue({
      crf7f_decommissioned: false,
    });

    const result = await checkDecommissioned(assetId);

    expect(result).toBe(false);
  });

  it('returns false when crf7f_decommissioned is missing', async () => {
    dataverseCall.mockResolvedValue({});

    const result = await checkDecommissioned(assetId);

    expect(result).toBe(false);
  });

  it('propagates errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Dataverse failure'));

    await expect(checkDecommissioned(assetId)).rejects.toThrow(
      'Dataverse failure',
    );
  });
});
