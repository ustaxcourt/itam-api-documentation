import { getId } from './yourModule.js';
import { dataverseCall } from '../persistence/dataverseCall.js';
import { AppError } from '../errors/error.js';

jest.mock('../persistence/dataverseCall.js');

describe('getId', () => {
  const DATAVERSE_URL = 'https://example.com';
  beforeEach(() => {
    process.env.DATAVERSE_URL = DATAVERSE_URL;
    jest.clearAllMocks();
  });

  it('should return the correct ID when dataverseCall succeeds', async () => {
    const mockResponse = {
      data: {
        value: [{ accountid: '12345' }],
      },
    };
    dataverseCall.mockResolvedValue(mockResponse);

    const result = await getId('accounts', 'name', 'Test Account');

    expect(dataverseCall).toHaveBeenCalledWith(
      `${DATAVERSE_URL}/api/data/v9.2/accounts?$filter=name eq 'Test Account'`,
      'GET',
    );
    expect(result).toBe('12345');
  });

  it('should throw AppError when dataverseCall fails without passUp', async () => {
    dataverseCall.mockRejectedValue(new Error('Network error'));

    await expect(getId('accounts', 'name', 'Test Account')).rejects.toThrow(
      AppError,
    );
    await expect(
      getId('accounts', 'name', 'Test Account'),
    ).rejects.toMatchObject({
      statusCode: 404,
      message: 'ID not found',
    });
  });

  it('should rethrow error when error.passUp is true', async () => {
    const error = new Error('Critical error');
    error.passUp = true;
    dataverseCall.mockRejectedValue(error);

    await expect(getId('accounts', 'name', 'Test Account')).rejects.toBe(error);
  });
});
