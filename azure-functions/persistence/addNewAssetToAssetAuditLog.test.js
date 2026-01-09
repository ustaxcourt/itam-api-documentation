import { addNewAssetToAssetAuditLog } from './addNewAssetToAssetAuditLog.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./dataverseCall.js');

describe('addNewAssetToAssetAuditLog', () => {
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
    dataverseCall.mockResolvedValue({ success: true });

    const result = await addNewAssetToAssetAuditLog(
      'assetName',
      'Poor',
      '123',
      'big notes',
      'Assignment',
    );

    expect(dataverseCall).toHaveBeenCalledWith({
      body: {
        crf7f_name: 'assetName',
        crf7f_condition: 'Poor',
        crf7f_zendesk_ticket_number: '123',
        crf7f_notes: 'big notes',
        crf7f_action: 'Assignment',
      },
      method: 'POST',
      query: 'crf7f_ois_asset_audit_logs',
    });
    expect(result).toEqual({ success: true });
  });

  it('should rethrow InternalServerError if caught', async () => {
    dataverseCall.mockRejectedValue(new InternalServerError('Server issue'));

    await expect(
      addNewAssetToAssetAuditLog(
        'assetName',
        'Poor',
        '123',
        'big notes',
        'Assignment',
      ),
    ).rejects.toThrow(InternalServerError);
  });

  it('should rethrow DataverseTokenError if caught', async () => {
    dataverseCall.mockRejectedValue(new DataverseTokenError('Token expired'));

    await expect(
      addNewAssetToAssetAuditLog(
        'assestName',
        'Poor',
        '123',
        'big notes',
        'Assignment',
      ),
    ).rejects.toThrow(DataverseTokenError);
  });

  it('should throw InternalServerError when an unknown error occurs', async () => {
    dataverseCall.mockRejectedValue(
      new Error('The problem is not with dataverseCall but this function'),
    );

    await expect(
      addNewAssetToAssetAuditLog(
        'assestName',
        'Poor',
        '123',
        'big notes',
        'Assignment',
      ),
    ).rejects.toThrow(InternalServerError);
  });
});
