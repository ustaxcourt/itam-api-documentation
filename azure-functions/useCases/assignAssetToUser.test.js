import { assignAssetToUser } from './assignAssetToUser.js';
import { assignAssetOwner } from '../persistence/assignAssetOwner.js';
import { conditionallyUpdateAssetAuditLog } from './conditionallyUpdateAssetAuditLog.js';
import { expect } from '@jest/globals';

jest.mock('./conditionallyUpdateAssetAuditLog.js');
jest.mock('../persistence/assignAssetOwner.js');

describe('assignAssetToUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  //Basic test if function is being called correctly
  it('calls assignAssetOwner with the given userID and assetID', async () => {
    await assignAssetToUser('testUser', 'asset123', {
      zenDeskTicketId: '123123',
      notes: 'this is a very big note',
    });

    expect(assignAssetOwner).toHaveBeenCalledTimes(1);
    expect(assignAssetOwner).toHaveBeenCalledWith('testUser', 'asset123');

    expect(conditionallyUpdateAssetAuditLog).toHaveBeenCalledTimes(1);
    expect(conditionallyUpdateAssetAuditLog).toHaveBeenCalled({
      zenDeskTicketId: '123123',
      notes: 'this is a very big note',
    });
  });

  //Basic tests for expected failure modes
  it('throws errors like assignAssetOwner', async () => {
    assignAssetOwner.mockRejectedValue(new Error('XXX: user not found'));
    await expect(assignAssetToUser('user123', 'asset123')).rejects.toThrow(
      'XXX: user not found',
    );
  });

  it('handles empty calls', async () => {
    assignAssetOwner.mockRejectedValue(new Error('XXX: user not found'));
    await expect(assignAssetToUser()).rejects.toThrow('XXX: user not found');
  });

  it('throws errors targeting the conditonally update', async () => {
    conditionallyUpdateAssetAuditLog.mockRejectedValue(
      new Error('XXX: user not found'),
    );
    await expect(assignAssetToUser('user123', 'asset123')).rejects.toThrow(
      'XXX: user not found',
    );
  });

  it('handles empty calls targeting conditionally update', async () => {
    conditionallyUpdateAssetAuditLog.mockRejectedValue(
      new Error('XXX: user not found'),
    );
    await expect(assignAssetToUser()).rejects.toThrow('XXX: user not found');
  });
});
