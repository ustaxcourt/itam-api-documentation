import { decommissionWrapper } from './decommissionWrapper.js';
import { decommission } from '../persistence/decommission.js';
import { getAssetByID } from '../persistence/getAssetByID.js';
import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { BadRequest } from '../errors/BadRequest.js';
import { checkDecommissioned } from '../persistence/checkDecommissioned.js';
import { it } from '@jest/globals';

jest.mock('../persistence/checkDecommissioned.js', () => ({
  checkDecommissioned: jest.fn(),
}));

jest.mock('../persistence/decommission.js', () => ({
  decommission: jest.fn(),
}));

jest.mock('../persistence/getAssetByID.js', () => ({
  getAssetByID: jest.fn(),
}));

jest.mock('../persistence/addNewEntryToAssetAuditLog.js', () => ({
  addNewEntryToAssetAuditLog: jest.fn(),
}));

describe('decommissionWrapper', () => {
  const assetId = 'asset123';

  const validAsset = {
    assetName: 'Dell Latitude',
    user: null, // unassigned
    condition: 'Good', // maps to AUDIT_LOG_CHOICES.Good === 1
  };

  beforeEach(() => {
    jest.resetAllMocks();

    getAssetByID.mockResolvedValue(validAsset);
    decommission.mockResolvedValue();
    addNewEntryToAssetAuditLog.mockResolvedValue({
      id: 'audit-log-id',
    });
    checkDecommissioned.mockResolvedValue(false);
  });

  it('successfully decommissions an unassigned asset and writes audit log entry', async () => {
    await decommissionWrapper(assetId);

    expect(getAssetByID).toHaveBeenCalledWith(assetId);
    expect(decommission).toHaveBeenCalledWith(assetId);

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledTimes(1);
    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Dell Latitude', // assetName
      1, // Good
      null, // zendesk ticket ID
      null, // notes
      'Decommissioned',
    );
  });

  it('fails when asset is still assigned to a user', async () => {
    getAssetByID.mockResolvedValue({
      ...validAsset,
      user: 'user@company.com',
    });

    await expect(decommissionWrapper(assetId)).rejects.toBeInstanceOf(
      BadRequest,
    );

    await expect(decommissionWrapper(assetId)).rejects.toThrow(
      'This asset must be unassigned before it can be decommissioned',
    );

    expect(decommission).not.toHaveBeenCalled();
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('fails when asset condition is not mapped in AUDIT_LOG_CHOICES', async () => {
    getAssetByID.mockResolvedValue({
      ...validAsset,
      condition: 'UnknownCondition',
    });

    await expect(decommissionWrapper(assetId)).rejects.toBeInstanceOf(
      InternalServerError,
    );

    await expect(decommissionWrapper(assetId)).rejects.toThrow(
      "Condition 'UnknownCondition' is not mapped in OptionSet.",
    );

    expect(decommission).not.toHaveBeenCalled();
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('rethrows NotFoundError from getAssetByID without wrapping', async () => {
    getAssetByID.mockRejectedValue(new NotFoundError('Asset not found'));

    await expect(decommissionWrapper(assetId)).rejects.toBeInstanceOf(
      NotFoundError,
    );

    await expect(decommissionWrapper(assetId)).rejects.toThrow(
      'Asset not found',
    );

    expect(decommission).not.toHaveBeenCalled();
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('throws BadRequest based on results from checkDecommissioned without wrapping', async () => {
    checkDecommissioned.mockResolvedValue(true); // Asset is already decommissioned

    await expect(decommissionWrapper(assetId)).rejects.toBeInstanceOf(
      BadRequest,
    );

    await expect(decommissionWrapper(assetId)).rejects.toThrow(
      'This asset is already decommissioned.',
    );

    expect(decommission).not.toHaveBeenCalled();
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('wraps errors from decommission in InternalServerError and skips audit log', async () => {
    decommission.mockRejectedValue(new Error('Dataverse PATCH failed'));

    await expect(decommissionWrapper(assetId)).rejects.toBeInstanceOf(
      InternalServerError,
    );

    await expect(decommissionWrapper(assetId)).rejects.toThrow(
      'Decommission operation failed: Dataverse PATCH failed',
    );

    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('fails if audit log creation fails', async () => {
    addNewEntryToAssetAuditLog.mockRejectedValue(
      new InternalServerError('Audit log failure'),
    );

    await expect(decommissionWrapper(assetId)).rejects.toBeInstanceOf(
      InternalServerError,
    );

    await expect(decommissionWrapper(assetId)).rejects.toThrow(
      'Audit log failure',
    );

    expect(decommission).toHaveBeenCalled();
  });
});
