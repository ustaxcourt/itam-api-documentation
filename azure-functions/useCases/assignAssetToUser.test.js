import { assignAssetToUser } from './assignAssetToUser.js';
import { assignAssetOwner } from '../persistence/assignAssetOwner.js';
import { updateAssetAuditLog } from '../persistence/updateAssetAuditLog.js';
import { updateAssetCondition } from '../persistence/updateAssetCondition.js';
import { deleteAssetAuditLogEntry } from '../persistence/deleteAssetAuditLogEntry.js';
import { withRetry } from '../persistence/withRetry.js';

jest.mock('../persistence/updateAssetAuditLog.js');
jest.mock('../persistence/assignAssetOwner.js');
jest.mock('../persistence/updateAssetCondition.js');
jest.mock('../persistence/deleteAssetAuditLogEntry.js');
jest.mock('../persistence/withRetry.js');

describe('assignAssetToUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    updateAssetAuditLog.mockResolvedValue({
      auditId: 'mock-audit-id',
      conditionCode: 2,
    });

    // withRetry should just call the passed fn
    withRetry.mockImplementation(async fn => fn());

    updateAssetCondition.mockResolvedValue();
    assignAssetOwner.mockResolvedValue();
    deleteAssetAuditLogEntry.mockResolvedValue();
  });

  it('calls assignAssetOwner with the given userID and assetID', async () => {
    await assignAssetToUser('testUser', 'asset123', {
      zendeskTicketId: '123123',
      notes: 'this is a very big note',
      condition: 'Good',
    });

    expect(assignAssetOwner).toHaveBeenCalledTimes(1);
    expect(assignAssetOwner).toHaveBeenCalledWith('testUser', 'asset123');

    expect(updateAssetAuditLog).toHaveBeenCalledWith('asset123', {
      zendeskTicketId: '123123',
      notes: 'this is a very big note',
      condition: 'Good',
    });
  });

  it('throws errors like assignAssetOwner', async () => {
    assignAssetOwner.mockRejectedValue(new Error('XXX: user not found'));

    await expect(
      assignAssetToUser('user123', 'asset123', {
        zendeskTicketId: 123,
        condition: 'Poor',
      }),
    ).rejects.toThrow(
      'Assignment failed. Audit entry removed from log history',
    );
  });

  it('handles empty calls', async () => {
    assignAssetOwner.mockRejectedValue(new Error('XXX: user not found'));

    await expect(
      assignAssetToUser(undefined, undefined, {
        zendeskTicketId: 123,
        condition: 'Poor',
      }),
    ).rejects.toThrow(
      'Assignment failed. Audit entry removed from log history',
    );
  });

  it('throws errors targeting the conditionally update', async () => {
    updateAssetAuditLog.mockRejectedValue(new Error('XXX: user not found'));

    await expect(
      assignAssetToUser('user123', 'asset123', {
        zendeskTicketId: 456,
        condition: 'Poor',
      }),
    ).rejects.toThrow('XXX: user not found');
  });

  it('handles empty calls targeting conditionally update', async () => {
    updateAssetAuditLog.mockRejectedValue(new Error('XXX: user not found'));

    await expect(
      assignAssetToUser(undefined, undefined, {
        zendeskTicketId: 456,
        condition: 'Good',
      }),
    ).rejects.toThrow('XXX: user not found');
  });
});
