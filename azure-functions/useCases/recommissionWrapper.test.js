import { recommissionWrapper } from './recommissionWrapper.js';
import { recommission } from '../persistence/recommission.js';
import { getAssetByID } from '../persistence/getAssetByID.js';
import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { BadRequest } from '../errors/BadRequest.js';
import { checkDecommissioned } from '../persistence/checkDecommissioned.js';

jest.mock('../persistence/checkDecommissioned.js', () => ({
  checkDecommissioned: jest.fn(),
}));

jest.mock('../persistence/recommission.js', () => ({
  recommission: jest.fn(),
}));

jest.mock('../persistence/getAssetByID.js', () => ({
  getAssetByID: jest.fn(),
}));

jest.mock('../persistence/addNewEntryToAssetAuditLog.js', () => ({
  addNewEntryToAssetAuditLog: jest.fn(),
}));

describe('recommissionWrapper', () => {
  const assetId = 'asset123';

  const validAsset = {
    assetName: 'Dell Latitude',
    condition: 'Good', // maps to AUDIT_LOG_CHOICES.Good === 1
  };

  beforeEach(() => {
    jest.resetAllMocks();

    getAssetByID.mockResolvedValue(validAsset);
    recommission.mockResolvedValue();
    addNewEntryToAssetAuditLog.mockResolvedValue({
      id: 'audit-log-id',
    });
    checkDecommissioned.mockResolvedValue(true);
  });

  it('successfully recommissions an asset and writes audit log entry', async () => {
    await recommissionWrapper(assetId);

    expect(getAssetByID).toHaveBeenCalledWith(assetId);
    expect(recommission).toHaveBeenCalledWith(assetId);

    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledTimes(1);
    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'Dell Latitude', // assetName
      1, // AUDIT_LOG_CHOICES -> Good
      null, // zendesk ticket ID
      null, // notes
      'Recommissioned',
    );
  });

  it('fails when asset condition is not mapped in AUDIT_LOG_CHOICES', async () => {
    getAssetByID.mockResolvedValue({
      ...validAsset,
      condition: 'UnknownCondition',
    });

    await expect(recommissionWrapper(assetId)).rejects.toBeInstanceOf(
      InternalServerError,
    );

    await expect(recommissionWrapper(assetId)).rejects.toThrow(
      "Condition 'UnknownCondition' is not mapped in OptionSet.",
    );

    expect(recommission).not.toHaveBeenCalled();
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('rethrows NotFoundError from getAssetByID without wrapping', async () => {
    getAssetByID.mockRejectedValue(new NotFoundError('Asset not found'));

    await expect(recommissionWrapper(assetId)).rejects.toBeInstanceOf(
      NotFoundError,
    );

    await expect(recommissionWrapper(assetId)).rejects.toThrow(
      'Asset not found',
    );

    expect(recommission).not.toHaveBeenCalled();
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('throws BadRequest based on results from checkDecommissioned without wrapping', async () => {
    checkDecommissioned.mockResolvedValue(false); // Asset is not decommissioned / is active

    await expect(recommissionWrapper(assetId)).rejects.toBeInstanceOf(
      BadRequest,
    );

    await expect(recommissionWrapper(assetId)).rejects.toThrow(
      'This asset is not currently decommissioned and cannot be recommissioned.',
    );

    expect(recommission).not.toHaveBeenCalled();
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('wraps errors from recommission in InternalServerError and skips audit log', async () => {
    recommission.mockRejectedValue(new Error('Dataverse PATCH failed'));

    await expect(recommissionWrapper(assetId)).rejects.toBeInstanceOf(
      InternalServerError,
    );

    await expect(recommissionWrapper(assetId)).rejects.toThrow(
      'Recommission operation failed: Dataverse PATCH failed',
    );

    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('fails if audit log creation fails', async () => {
    addNewEntryToAssetAuditLog.mockRejectedValue(
      new InternalServerError('Audit log failure'),
    );

    await expect(recommissionWrapper(assetId)).rejects.toBeInstanceOf(
      InternalServerError,
    );

    await expect(recommissionWrapper(assetId)).rejects.toThrow(
      'Audit log failure',
    );

    expect(recommission).toHaveBeenCalled();
  });
});
