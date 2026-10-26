import { filterDictionaryLocation } from './filterDictLocation.js';
import { filterDictionaryByListLocation } from './filterDictListLocation.js';

jest.mock('./filterDictLocation.js', () => ({
  filterDictionaryLocation: jest.fn(),
}));

describe('filterDictionaryByListLocation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls filterDictionaryLocation once for each item in the list', () => {
    const input = [{ a: 1 }, { b: 2 }];
    filterDictionaryLocation.mockReturnValue({});

    filterDictionaryByListLocation(input);

    expect(filterDictionaryLocation).toHaveBeenCalledTimes(2);
    expect(filterDictionaryLocation).toHaveBeenCalledWith(input[0]);
    expect(filterDictionaryLocation).toHaveBeenCalledWith(input[1]);
  });

  it('returns an array of processed items', () => {
    const input = [{ a: 1 }, { b: 2 }];
    filterDictionaryLocation.mockImplementation(item => ({
      processed: item,
    }));

    const result = filterDictionaryByListLocation(input);

    expect(result).toEqual([{ processed: { a: 1 } }, { processed: { b: 2 } }]);
  });

  it('returns an empty array when given an empty list', () => {
    const result = filterDictionaryByListLocation([]);

    expect(result).toEqual([]);
    expect(filterDictionaryLocation).not.toHaveBeenCalled();
  });

  it('handles a single-item list correctly', () => {
    const input = [{ a: 1 }];
    filterDictionaryLocation.mockReturnValue({ processed: true });

    const result = filterDictionaryByListLocation(input);

    expect(result).toEqual([{ processed: true }]);
    expect(filterDictionaryLocation).toHaveBeenCalledTimes(1);
  });

  it('preserves order of processed items', () => {
    const input = [{ id: 1 }, { id: 2 }, { id: 3 }];

    filterDictionaryLocation
      .mockImplementationOnce(() => ({ id: 'first' }))
      .mockImplementationOnce(() => ({ id: 'second' }))
      .mockImplementationOnce(() => ({ id: 'third' }));

    const result = filterDictionaryByListLocation(input);

    expect(result).toEqual([
      { id: 'first' },
      { id: 'second' },
      { id: 'third' },
    ]);
  });
});
