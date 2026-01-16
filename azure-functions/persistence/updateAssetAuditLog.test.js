import { updateAssetAuditLog } from './updateAssetAuditLog.js';
import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { getChoiceFieldIntegersFromAssetAuditLogTable } from '../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js';
import { getAssetDetails } from '../useCases/getAssetDetails.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

jest.mock('../persistence/addNewEntryToAssetAuditLog.js');
jest.mock('../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js');
jest.mock('../useCases/getAssetDetails.js');

describe('updateAssetAuditLog', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    getAssetDetails.mockResolvedValue({
      assetName: 'Device #1',
      condition: 'Poor',
    });

    getChoiceFieldIntegersFromAssetAuditLogTable.mockResolvedValue({
      Excellent: 0,
      Good: 1,
      Poor: 2,
      Garbage: 3,
      Damaged: 4,
      New: 5,
    });

    addNewEntryToAssetAuditLog.mockResolvedValue({ id: 'mock-created-id' });
  });

  it('uses condition from body (required) and passes user-defined action', async () => {
    const result = await updateAssetAuditLog('asset123', {
      zendeskTicketId: 123123,
      notes: 'Condition changed to Good',
      condition: 'Good',
      action: 'Asset Assignment',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device #1',
      1,
      123123,
      'Condition changed to Good',
      'Asset Assignment',
    );

    // return shape
    expect(result).toEqual({
      auditId: 'mock-created-id',
      conditionCode: 1,
    });
  });

  it('preserves asset name characters', async () => {
    getAssetDetails.mockResolvedValue({
      assetName: 'HP EliteDisplay E241i #22',
      condition: 'Poor',
    });

    const result = await updateAssetAuditLog('asset123', {
      zendeskTicketId: '555',
      notes: 'encoding test',
      condition: 'Poor',
      action: 'Transfer',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'HP EliteDisplay E241i #22',
      2,
      555,
      'encoding test',
      'Transfer',
    );

    expect(result).toEqual({
      auditId: 'mock-created-id',
      conditionCode: 2,
    });
  });

  it('transforms zendeskTicketId to a number', async () => {
    const result = await updateAssetAuditLog('asset123', {
      zendeskTicketId: '999',
      notes: 'ticket as string',
      condition: 'Poor',
      action: 'Return',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device #1',
      2,
      999,
      'ticket as string',
      'Return',
    );

    expect(result).toEqual({
      auditId: 'mock-created-id',
      conditionCode: 2,
    });
  });

  it('passes notes as null when not provided', async () => {
    const result = await updateAssetAuditLog('asset123', {
      zendeskTicketId: 321,
      condition: 'Poor',
      action: 'Dispose',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device #1',
      2,
      321,
      null,
      'Dispose',
    );

    expect(result).toEqual({
      auditId: 'mock-created-id',
      conditionCode: 2,
    });
  });

  it('passes action as null when not provided', async () => {
    const result = await updateAssetAuditLog('asset123', {
      zendeskTicketId: 101,
      notes: 'no action provided',
      condition: 'Good',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device #1',
      1,
      101,
      'no action provided',
      null,
    );

    expect(result).toEqual({
      auditId: 'mock-created-id',
      conditionCode: 1,
    });
  });

  it('throws InternalServerError when condition is missing from body', async () => {
    await expect(
      updateAssetAuditLog('asset123', {
        zendeskTicketId: 123,
        notes: 'missing condition',
        action: 'Asset Assignment',
      }),
    ).rejects.toThrow(InternalServerError);

    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
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
