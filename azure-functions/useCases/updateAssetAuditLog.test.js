import { updateAssetAuditLog } from './updateAssetAuditLog.js';
import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { getChoiceFieldIntegersFromAssetAuditLogTable } from '../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js';
import { getAssetDetails } from './getAssetDetails.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

jest.mock('../persistence/addNewEntryToAssetAuditLog.js');
jest.mock('../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js');
jest.mock('./getAssetDetails.js');

describe('updateAssetAuditLog', () => {
  beforeEach(() => {
    jest.resetAllMocks();

    // Default: asset with condition "Poor", choice mapping includes "Poor"
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

  it('uses condition from body when provided', async () => {
    await updateAssetAuditLog('asset123', {
      zenDeskTicketId: 123123,
      notes: 'Condition changed to Good',
      condition: 'Good',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device %231', // "#" encoded
      1, // Good
      123123, // coerced to number
      'Condition changed to Good',
      'Asset Assignment',
    );
  });

  it('falls back to existing asset condition when body.condition is not provided', async () => {
    await updateAssetAuditLog('asset123', {
      zenDeskTicketId: 444,
      notes: 'No condition provided',
      // condition omitted
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device %231',
      2, // Poor
      444,
      'No condition provided',
      'Asset Assignment',
    );
  });

  it('encodes assetName by replacing "#" with "%23"', async () => {
    getAssetDetails.mockResolvedValue({
      assetName: 'HP EliteDisplay E241i #22',
      condition: 'Poor',
    });

    await updateAssetAuditLog('asset123', {
      zenDeskTicketId: '555', // string; should be transformed
      notes: 'encoding test',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'HP EliteDisplay E241i %2322',
      2,
      555,
      'encoding test',
      'Asset Assignment',
    );
  });

  it('coerces zenDeskTicketId to a number', async () => {
    await updateAssetAuditLog('asset123', {
      zenDeskTicketId: '999', // string input
      notes: 'ticket as string',
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device %231',
      2,
      999, // transformed to numeric
      'ticket as string',
      'Asset Assignment',
    );
  });

  it('passes notes as null when not provided', async () => {
    await updateAssetAuditLog('asset123', {
      zenDeskTicketId: 321,
      // notes omitted
    });

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Device %231',
      2,
      321,
      null,
      'Asset Assignment',
    );
  });

  it('throws InternalServerError when condition label is not in the choices map', async () => {
    getAssetDetails.mockResolvedValue({
      assetName: 'Device #1',
      condition: 'UnknownLabel',
    });

    await expect(
      updateAssetAuditLog('asset123', { zenDeskTicketId: 123 }),
    ).rejects.toThrow(InternalServerError);

    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('bubbles up a DataverseTokenError thrown by the persistence layer', async () => {
    addNewEntryToAssetAuditLog.mockRejectedValue(
      new DataverseTokenError('Token expired'),
    );

    await expect(
      updateAssetAuditLog('asset123', {
        zenDeskTicketId: 100,
        notes: 'token error',
      }),
    ).rejects.toThrow(DataverseTokenError);
  });

  it('bubbles up an InternalServerError thrown by the persistence layer', async () => {
    addNewEntryToAssetAuditLog.mockRejectedValue(
      new InternalServerError('Dataverse create failed'),
    );

    await expect(
      updateAssetAuditLog('asset123', {
        zenDeskTicketId: 100,
        notes: 'internal error',
      }),
    ).rejects.toThrow(InternalServerError);
  });
});
