import { deleteAssetAuditLogEntry } from './deleteAssetAuditLogEntry.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./dataverseCall.js', () => ({
  dataverseCall: jest.fn(),
}));

describe('deleteAssetAuditLogEntry', () => {
  const auditId = 'audit-log-guid-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls dataverseCall with correct DELETE query', async () => {
    dataverseCall.mockResolvedValue(null);

    await deleteAssetAuditLogEntry(auditId);

    expect(dataverseCall).toHaveBeenCalledTimes(1);
    expect(dataverseCall).toHaveBeenCalledWith({
      query: `crf7f_ois_asset_audit_logs(${auditId})`,
      method: 'DELETE',
    });
  });

  it('resolves successfully when dataverseCall succeeds', async () => {
    dataverseCall.mockResolvedValue(undefined);

    await expect(deleteAssetAuditLogEntry(auditId)).resolves.toBeUndefined();
  });

  it('propagates errors from dataverseCall', async () => {
    dataverseCall.mockRejectedValue(new Error('Dataverse delete failed'));

    await expect(deleteAssetAuditLogEntry(auditId)).rejects.toThrow(
      'Dataverse delete failed',
    );
  });
});
