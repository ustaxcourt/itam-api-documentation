import { getLocationByName } from './getLocationByName';
import { dataverseCall } from './dataverseCall';
import { NotFoundError } from '../errors/NotFoundError';
import { InternalServerError } from '../errors/InternalServerError';

jest.mock('./dataverseCall.js');

describe('getLocationByName', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should return rowId when location exists', async () => {
    dataverseCall.mockResolvedValue({
      value: [{ crf7f_fac_asset_ref_locationid: 'row-123' }],
    });

    const result = await getLocationByName({ locationname: 'name' });
    const expectedQuery = `crf7f_fac_asset_ref_locations?$filter=crf7f_name eq 'name'`;

    expect(dataverseCall).toHaveBeenCalledWith({
      query: expectedQuery,
      method: 'GET',
    });
    expect(result).toBe('row-123');
  });

  it('should throw a NotFoundError when response has empty value array', async () => {
    dataverseCall.mockResolvedValue({ value: [] });

    await expect(getLocationByName({ locationname: '123' })).rejects.toThrow(
      new NotFoundError('No location found for name: 123'),
    );
  });

  it('should throw an Internal Server Error when response structure is malformed', async () => {
    dataverseCall.mockResolvedValue({});

    await expect(getLocationByName({ locationname: '123' })).rejects.toThrow(
      new InternalServerError('Dataverse call failed'),
    );
  });

  it('should propagate the error when dataverseCall throws an error', async () => {
    dataverseCall.mockRejectedValue(new Error('Network failure'));

    await expect(getLocationByName({ locationname: '123' })).rejects.toThrow(
      new Error('Network failure'),
    );
  });
});
