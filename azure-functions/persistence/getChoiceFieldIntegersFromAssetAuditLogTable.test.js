import { getChoiceFieldIntegersFromAssetAuditLogTable } from './getChoiceFieldIntegersFromAssetAuditLogTable.js';
import { restructureDataverseChoiceResponse } from './restructureDataverseChoiceResponse.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { dataverseCall } from './dataverseCall.js';
import { mockOptionSet } from '../tests/mocks/mockOptionSet.js';

jest.mock('./dataverseCall.js');
jest.mock('./restructureDataverseChoiceResponse.js', () => ({
  restructureDataverseChoiceResponse: jest.fn(),
}));

describe('getChoiceFieldIntegersFromAssetAuditLogTable', () => {
  const DATAVERSE_URL = 'https://example.com';
  let originalEnv;

  beforeAll(() => {
    originalEnv = process.env.DATAVERSE_URL;
  });

  beforeEach(() => {
    process.env.DATAVERSE_URL = DATAVERSE_URL;
    jest.resetAllMocks();
  });

  afterAll(() => {
    process.env.DATAVERSE_URL = originalEnv;
  });

  it('should call dataverseCall with correct URL, method, and body', async () => {
    dataverseCall.mockResolvedValue(mockOptionSet);

    restructureDataverseChoiceResponse.mockReturnValue({
      Excellent: 0,
      Good: 1,
      Poor: 2,
      Garbage: 3,
      Damaged: 4,
      New: 5,
    });

    const result = await getChoiceFieldIntegersFromAssetAuditLogTable();

    expect(dataverseCall).toHaveBeenCalledWith({
      method: 'GET',
      query: `EntityDefinitions(LogicalName='crf7f_ois_asset_audit_log')/Attributes(LogicalName='crf7f_condition')/Microsoft.Dynamics.CRM.PicklistAttributeMetadata?$expand=OptionSet`,
    });

    expect(restructureDataverseChoiceResponse).toHaveBeenCalledWith(
      mockOptionSet.OptionSet.Options,
    );

    expect(result).toEqual({
      Excellent: 0,
      Good: 1,
      Poor: 2,
      Garbage: 3,
      Damaged: 4,
      New: 5,
    });
  });

  it('should rethrow InternalServerError if caught', async () => {
    dataverseCall.mockRejectedValue(new InternalServerError('Server issue'));

    await expect(
      getChoiceFieldIntegersFromAssetAuditLogTable(),
    ).rejects.toThrow(InternalServerError);

    expect(restructureDataverseChoiceResponse).not.toHaveBeenCalled();
  });

  it('should throw NotFoundError when Choice field is empty', async () => {
    dataverseCall.mockResolvedValue({ OptionSet: { Options: [] } });

    await expect(
      getChoiceFieldIntegersFromAssetAuditLogTable(),
    ).rejects.toThrow(NotFoundError);

    expect(restructureDataverseChoiceResponse).not.toHaveBeenCalled();
  });
});
