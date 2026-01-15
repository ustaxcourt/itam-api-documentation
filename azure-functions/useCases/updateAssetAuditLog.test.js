import { updateAssetAuditLog } from './updateAssetAuditLog.js';
import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { getChoiceFieldIntegersFromAssetAuditLogTable } from '../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js';
import { getAssetDetails } from './getAssetDetails.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { updateAssetCondition } from '../persistence/updateAssetCondition.js';

jest.mock('../persistence/addNewEntryToAssetAuditLog.js');
jest.mock('../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js');
jest.mock('./getAssetDetails.js');
jest.mock('../persistence/updateAssetCondition.js');

describe('updateAssetAuditLog', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Default asset details
    getAssetDetails.mockResolvedValue({
      assetName: 'Device #1',
      condition: 'Poor',
    });

    // Choice map for condition label -> integer
    getChoiceFieldIntegersFromAssetAuditLogTable.mockResolvedValue({
      Excellent: 0,
      Good: 1,
      Poor: 2,
      Garbage: 3,
      Damaged: 4,
      New: 5,
    });

    addNewEntryToAssetAuditLog.mockResolvedValue({ id: 'mock-created-id' });
    updateAssetCondition.mockResolvedValue(undefined);
  });

  it('uses condition from body (required) and passes user-defined action', async () => {
    await updateAssetAuditLog('asset123', {
      zendeskTicketId: 123123,
      notes: 'Condition changed to Good',
      condition: 'Good',
      action: 'Asset Assignment',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device %231', // "#" encoded
      1, // Good
      123123, // numeric
      'Condition changed to Good',
      'Asset Assignment',
    );

    // Also updates base table condition
    expect(updateAssetCondition).toHaveBeenCalledWith('asset123', 1);
  });

  it('encodes assetName by replacing "#" with "%23"', async () => {
    getAssetDetails.mockResolvedValue({
      assetName: 'HP EliteDisplay E241i #22',
      condition: 'Poor',
    });

    await updateAssetAuditLog('asset123', {
      zendeskTicketId: '555',
      notes: 'encoding test',
      condition: 'Poor',
      action: 'Transfer',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'HP EliteDisplay E241i %2322',
      2, // Poor
      555, // transformed to numeric
      'encoding test',
      'Transfer',
    );
    expect(updateAssetCondition).toHaveBeenCalledWith('asset123', 2);
  });

  it('transforms zendeskTicketId to a number', async () => {
    await updateAssetAuditLog('asset123', {
      zendeskTicketId: '999', // string input
      notes: 'ticket as string',
      condition: 'Poor',
      action: 'Return',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device %231',
      2,
      999,
      'ticket as string',
      'Return',
    );
    expect(updateAssetCondition).toHaveBeenCalledWith('asset123', 2);
  });

  it('passes notes as null when not provided', async () => {
    await updateAssetAuditLog('asset123', {
      zendeskTicketId: 321,
      // notes omitted
      condition: 'Poor',
      action: 'Dispose',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device %231',
      2,
      321,
      null,
      'Dispose',
    );
    expect(updateAssetCondition).toHaveBeenCalledWith('asset123', 2);
  });

  it('passes action as null when not provided', async () => {
    await updateAssetAuditLog('asset123', {
      zendeskTicketId: 101,
      notes: 'no action provided',
      condition: 'Good',
      // action omitted
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device %231',
      1,
      101,
      'no action provided',
      null,
    );
    expect(updateAssetCondition).toHaveBeenCalledWith('asset123', 1);
  });

  it('throws InternalServerError when condition is missing from body', async () => {
    await expect(
      updateAssetAuditLog('asset123', {
        zendeskTicketId: 123,
        notes: 'missing condition',
        // condition omitted
        action: 'Asset Assignment',
      }),
    ).rejects.toThrow(InternalServerError);

    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
    expect(updateAssetCondition).not.toHaveBeenCalled();
  });

  it('throws InternalServerError when condition label is not in the choices map', async () => {
    await expect(
      updateAssetAuditLog('asset123', {
        zendeskTicketId: 123,
        notes: 'bad label',
        condition: 'NotInMap',
        action: 'Asset Assignment',
      }),
    ).rejects.toThrow(InternalServerError);

    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
    expect(updateAssetCondition).not.toHaveBeenCalled();
  });

  it('bubbles up a DataverseTokenError thrown by the persistence layer', async () => {
    addNewEntryToAssetAuditLog.mockRejectedValue(
      new DataverseTokenError('Token expired'),
    );

    await expect(
      updateAssetAuditLog('asset123', {
        zendeskTicketId: 100,
        notes: 'token error',
        condition: 'Good',
        action: 'Repair',
      }),
    ).rejects.toThrow(DataverseTokenError);
  });

  it('bubbles up an InternalServerError thrown by the persistence layer', async () => {
    addNewEntryToAssetAuditLog.mockRejectedValue(
      new InternalServerError('Dataverse create failed'),
    );

    await expect(
      updateAssetAuditLog('asset123', {
        zendeskTicketId: 100,
        notes: 'internal error',
        condition: 'Good',
        action: 'Repair',
      }),
    ).rejects.toThrow(InternalServerError);
  });
});
