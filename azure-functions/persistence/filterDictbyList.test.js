import { filterDictionary } from './filterDict.js';
import { filterDictionaryByList } from './filterDictbyList.js';

jest.mock('./filterDict.js', () => ({
  filterDictionary: jest.fn(),
}));

describe('filterDictionaryByList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls filterDictionary once for each item in the list', () => {
    const input = [{ a: 1 }, { b: 2 }];
    filterDictionary.mockReturnValue({}); // Allows filterDict to run w/o errors

    filterDictionaryByList(input);

    expect(filterDictionary).toHaveBeenCalledTimes(2);
    expect(filterDictionary).toHaveBeenCalledWith(input[0]);
    expect(filterDictionary).toHaveBeenCalledWith(input[1]);
  });

  it('returns an array of processed items', () => {
    const input = [{ a: 1 }, { b: 2 }];
    filterDictionary.mockImplementation(item => ({ processed: item }));

    const result = filterDictionaryByList(input);

    expect(result).toEqual([{ processed: { a: 1 } }, { processed: { b: 2 } }]);
  });

  it('returns an empty array when given an empty list', () => {
    const result = filterDictionaryByList([]);
    expect(result).toEqual([]);
    expect(filterDictionary).not.toHaveBeenCalled();
  });
});
