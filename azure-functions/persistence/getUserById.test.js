import { getUserById } from './getUserById.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('./dataverseCall.js');

describe('getUserById', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return rowId when user exists', async () => {
    dataverseCall.mockResolvedValue({
      value: [{ crf7f_ois_asset_entra_dat_userid: 'row-123' }],
    });

    const result = await getUserById('test-user');
    const expectedQuery = `crf7f_ois_asset_entra_dat_users?$filter=crf7f_name eq 'test-user'`;

    expect(dataverseCall).toHaveBeenCalledWith({
      query: expectedQuery,
      method: 'GET',
    });
    expect(result).toBe('row-123');
  });

  it('should throw a NotFoundError when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getUserById('test-user')).rejects.toThrow(
      new NotFoundError('No user found for ID: test-user'),
    );
  });

  it('should throw an Internal Server Error when response structure is malformed', async () => {
    dataverseCall.mockResolvedValue({});

    await expect(getUserById('test-user')).rejects.toThrow(
      new InternalServerError('Dataverse call failed'),
    );
  });

  it('should propigate the error when dataverseCall throws an error', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(getUserById('test-user')).rejects.toThrow(
      new Error('Network failure'),
    );
  });
});
