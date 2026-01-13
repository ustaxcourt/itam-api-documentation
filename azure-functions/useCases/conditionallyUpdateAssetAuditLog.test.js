import { conditionallyUpdateAssetAuditLog } from './conditionallyUpdateAssetAuditLog.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

import { addNewEntryToAssetAuditLog } from '../persistence/addNewEntryToAssetAuditLog.js';
import { getChoiceFieldIntegersFromAssetAuditLogTable } from '../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js';
import { getLatestAssetAuditLogEntryCondition } from '../persistence/getLatestAssetAuditLogEntryCondition.js';
import { getAssetDetails } from './getAssetDetails.js';

jest.mock('../persistence/addNewEntryToAssetAuditLog.js');
jest.mock('../persistence/getChoiceFieldIntegersFromAssetAuditLogTable.js');
jest.mock('../persistence/getLatestAssetAuditLogEntryCondition.js');
jest.mock('./getAssetDetails.js');

describe('conditionallyUpdateAssetAuditLog', () => {
  const assetId = 'asset123';
  const body = {
    zenDeskTicketId: 123123,
    notes: 'this is a very big note',
  };

  beforeEach(() => {
    jest.resetAllMocks();

    getAssetDetails.mockResolvedValue({
      activation: true,
      assetName: 'HP EliteDisplay E241i #22',
      condition: 'Poor',
      itemStatus: 'Assigned',
      location: '316',
      osVersion: null,
      phone: null,
      user: {
        email: 'Tracy.Chung@ustaxcourt.gov',
        isActive: true,
        isContractor: false,
        jobTitle: 'Chambers Administrator',
        location: '432',
        name: 'Tracy Chung',
        phone: '202-521-4721',
      },
    });

    getChoiceFieldIntegersFromAssetAuditLogTable.mockResolvedValue({
      Excellent: 0,
      Good: 1,
      Poor: 2,
      Garbage: 3,
      Damaged: 4,
      New: 5,
    });

    getLatestAssetAuditLogEntryCondition.mockResolvedValue(2);
  });

  it('should call all functions successfully', async () => {
    await conditionallyUpdateAssetAuditLog(assetId, body);

    expect(getAssetDetails).toHaveBeenCalledWith(assetId);
    expect(getChoiceFieldIntegersFromAssetAuditLogTable).toHaveBeenCalledTimes(
      1,
    );
    expect(getLatestAssetAuditLogEntryCondition).toHaveBeenCalledWith(
      'HP EliteDisplay E241i %2322',
    );
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('should call addNewAssetToAssetAuditLog since condition has changed', async () => {
    getLatestAssetAuditLogEntryCondition.mockResolvedValue(3);

    await conditionallyUpdateAssetAuditLog(assetId, body);

    expect(getAssetDetails).toHaveBeenCalledWith(assetId);
    expect(getChoiceFieldIntegersFromAssetAuditLogTable).toHaveBeenCalledTimes(
      1,
    );
    expect(getLatestAssetAuditLogEntryCondition).toHaveBeenCalledWith(
      'HP EliteDisplay E241i %2322',
    );
    expect(addNewEntryToAssetAuditLog).toHaveBeenCalledWith(
      'HP EliteDisplay E241i %2322',
      2,
      123123,
      'this is a very big note',
      'Asset Assignment',
    );
  });

  it('should throw NotFoundError if location is not found', async () => {
    getAssetDetails.mockRejectedValue(new NotFoundError());

    await expect(
      conditionallyUpdateAssetAuditLog(assetId, body),
    ).rejects.toThrow(NotFoundError);

    expect(getChoiceFieldIntegersFromAssetAuditLogTable).not.toHaveBeenCalled();
    expect(getLatestAssetAuditLogEntryCondition).not.toHaveBeenCalled();
    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });

  it('should throw DataverseTokenError if asset retrieval fails with token error', async () => {
    getLatestAssetAuditLogEntryCondition.mockRejectedValue(
      new DataverseTokenError(),
    );

    await expect(
      conditionallyUpdateAssetAuditLog(assetId, body),
    ).rejects.toThrow(DataverseTokenError);

    expect(addNewEntryToAssetAuditLog).not.toHaveBeenCalled();
  });
});
