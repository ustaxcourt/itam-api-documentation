import { getLocationById } from './getLocationById.js';
import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('./dataverseCall.js'); // Mock dataverseCall

describe('getLocationById', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const locationId = '04d494f4-b5b9-f011-bbd2-000d3a56dc3b';

  it('should throw NotFoundError when no location is found', async () => {
    // Arrange: dataverseCall returns empty array

    dataverseCall.mockResolvedValue({ value: [] });

    // Act & Assert
    await expect(getLocationById(locationId)).rejects.toThrow(NotFoundError);
    await expect(getLocationById(locationId)).rejects.toThrow(
      `No location found for ID: ${locationId}`,
    );
  });

  it('should throw InternalServerError when response has no value property', async () => {
    dataverseCall.mockResolvedValue({}); // Missing value key

    await expect(getLocationById(locationId)).rejects.toThrow(
      InternalServerError,
    );
    await expect(getLocationById(locationId)).rejects.toThrow(
      'Dataverse call failed',
    );
  });

  it('should return location ID when found', async () => {
    dataverseCall.mockResolvedValue({
      value: [{ crf7f_fac_asset_ref_locationid: locationId }],
    });

    const result = await getLocationById(locationId);
    expect(result).toBe(locationId);
  });
});
