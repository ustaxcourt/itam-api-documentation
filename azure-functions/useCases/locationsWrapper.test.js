import { locationsWrapper } from './locationsWrapper.js';
import { getLocations } from '../persistence/getLocations.js';
import { NotFoundError } from '../errors/NotFoundError.js';

jest.mock('../persistence/getLocations.js', () => ({
  getLocations: jest.fn(),
}));

describe('locationsWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls getLocations successfully', async () => {
    await locationsWrapper();

    expect(getLocations).toHaveBeenCalledTimes(1);
    expect(getLocations).toHaveBeenCalledWith();
  });

  it('returns the resolved result from getLocations', async () => {
    const mockLocations = [{ name: 'Location A' }, { name: 'Location B' }];

    getLocations.mockResolvedValue(mockLocations);

    const result = await locationsWrapper();

    expect(result).toEqual(mockLocations);
  });

  it('returns empty array if persistence layer returns empty array', async () => {
    getLocations.mockResolvedValue([]);

    const result = await locationsWrapper();

    expect(result).toEqual([]);
  });

  it('bubbles up NotFoundError from persistence layer', async () => {
    getLocations.mockRejectedValue(new NotFoundError('No locations found'));

    await expect(locationsWrapper()).rejects.toThrow(NotFoundError);
  });

  it('bubbles up generic errors from persistence layer', async () => {
    getLocations.mockRejectedValue(new Error('Unexpected failure'));

    await expect(locationsWrapper()).rejects.toThrow(Error);
  });
});
