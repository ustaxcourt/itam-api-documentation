import { unassignAsset } from './unassignAsset.js';
import { unassignAssetOwner } from '../persistence/unassignAssetOwner.js';
import { updateAssetAuditLog } from '../persistence/updateAssetAuditLog.js';
import { updateAssetCondition } from '../persistence/updateAssetCondition.js';
import { deleteAssetAuditLogEntry } from '../persistence/deleteAssetAuditLogEntry.js';
import { withRetry } from '../persistence/withRetry.js';

jest.mock('../persistence/updateAssetAuditLog.js');
jest.mock('../persistence/unassignAssetOwner.js');
jest.mock('../persistence/updateAssetCondition.js');
jest.mock('../persistence/deleteAssetAuditLogEntry.js');
jest.mock('../persistence/withRetry.js');

describe('unassignAsset', () => {
  const validBody = {
    zendeskTicketId: 123123,
    condition: 'Good',
    notes: 'this is a very big note',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    updateAssetAuditLog.mockResolvedValue({
      auditId: 'someGUID123',
      conditionCode: 1,
    });

    // withRetry should just call the passed fn
    withRetry.mockImplementation(async fn => fn());

    updateAssetCondition.mockResolvedValue();
    unassignAssetOwner.mockResolvedValue();
    deleteAssetAuditLogEntry.mockResolvedValue();
  });

  it('correctly calls all child methods with given assetID', async () => {
    await unassignAsset('asset123', validBody);

    expect(updateAssetAuditLog).toHaveBeenCalledWith('asset123', validBody);
    expect(updateAssetCondition).toHaveBeenCalledWith('asset123', 1);
    expect(unassignAssetOwner).toHaveBeenCalledTimes(1);
    expect(unassignAssetOwner).toHaveBeenCalledWith('asset123');
  });

  it('rolls back audit log and throws an InternalServerError when unassign fails', async () => {
    unassignAssetOwner.mockRejectedValue(new Error('Dataverse Failure'));
    await expect(unassignAsset('asset123', validBody)).rejects.toThrow(
      'Assignment failed. Audit entry removed from log history',
    );
    expect(deleteAssetAuditLogEntry).toHaveBeenCalledWith('someGUID123');
  });

  // ensures that the useCase doesn't continue work after an error
  it('bubbles up errors when audit logging fails', async () => {
    updateAssetAuditLog.mockRejectedValue(
      new Error('Unable to add asset To Asset Audit Log'),
    );

    await expect(unassignAsset('asset123', validBody)).rejects.toThrow(
      'Unable to add asset To Asset Audit Log',
    );

    expect(updateAssetCondition).not.toHaveBeenCalled();
    expect(unassignAssetOwner).not.toHaveBeenCalled();
    expect(deleteAssetAuditLogEntry).not.toHaveBeenCalled();
  });
});
