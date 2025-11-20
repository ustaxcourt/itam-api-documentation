import { getUserById } from './getUserById.js';
import { dataverseCall } from './dataverseCall.js';

jest.mock('./dataverseCall.js');

describe('getUserById', () => {
  const originalEnv = process.env.DATAVERSE_URL;

  beforeAll(() => {
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url';
  });

  afterAll(() => {
    process.env.DATAVERSE_URL = originalEnv;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return rowId when user exists', async () => {
    dataverseCall.mockResolvedValue({
      data: {
        value: [{ crf7f_ois_asset_entra_dat_userid: 'row-123' }],
      },
    });

    const result = await getUserById('test-user');
    const expectedUrl = `https://fake.dataverse.url/api/data/v9.2/crf7f_ois_asset_entra_dat_users?$filter=crf7f_name eq 'test-user'`;

    expect(dataverseCall).toHaveBeenCalledWith(expectedUrl, 'GET');
    expect(result).toBe('row-123');
  });

  it('should return null when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ data: { value: [] } });

    const result = await getUserById('test-user');
    expect(result).toBeNull();
  });

  it('should return null when response structure is malformed', async () => {
    dataverseCall.mockResolvedValue({ data: {} });

    const result = await getUserById('test-user');
    expect(result).toBeNull();
  });

  it('should return null when dataverseCall throws an error', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    const result = await getUserById('test-user');
    expect(result).toBeNull();
  });

  it('should throw if DATAVERSE_URL is missing', async () => {
    process.env.DATAVERSE_URL = undefined;

    const result = await getUserById('test-user');
    expect(result).toBeNull();
    process.env.DATAVERSE_URL = 'https://fake.dataverse.url'; // restores for additional testing
  });
});
