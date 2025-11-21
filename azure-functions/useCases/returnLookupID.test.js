// __tests__/getId.test.js
import { getId } from './returnLookupID.js';
import { dataverseCall } from '../persistence/dataverseCall.js';
import { AppError } from '../errors/error.js';

jest.mock('../persistence/dataverseCall.js');

describe('getId', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...originalEnv,
      DATAVERSE_URL: 'https://mock.dataverse.com',
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('should return correct ID when dataverseCall succeeds', async () => {
    dataverseCall.mockResolvedValue({
      data: {
        value: [{ accountid: '12345' }],
      },
    });

    const result = await getId('accounts', 'name', 'TestAccount');
    expect(result).toBe('12345');
    expect(dataverseCall).toHaveBeenCalledWith(
      "https://mock.dataverse.com/api/data/v9.2/accounts?$filter=name eq 'TestAccount'",
      'GET',
    );
  });

  test('should throw AppError when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ data: { value: [] } });
    await expect(getId('accounts', 'name', 'TestAccount')).rejects.toThrow(
      AppError,
    );
  });

  test('should rethrow error if error.passUp is true', async () => {
    const error = new Error('Pass up error');
    error.passUp = true;
    dataverseCall.mockRejectedValue(error);

    await expect(getId('accounts', 'name', 'TestAccount')).rejects.toBe(error);
  });

  test('should throw AppError when error.passUp is false', async () => {
    dataverseCall.mockRejectedValue(new Error('Generic error'));

    await expect(getId('accounts', 'name', 'TestAccount')).rejects.toThrow(
      AppError,
    );
    await expect(getId('accounts', 'name', 'TestAccount')).rejects.toThrow(
      'ID not found',
    );
  });
});
