import { filterDictionary } from './filterDict.js';

describe('filterDictionary', () => {
  it('should filter and rename keys based on keyMap', () => {
    const input = {
      crf7f_email: 'user@example.com',
      crf7f_jobtitle: 'Engineer',
      unknown_key: 'should be ignored',
    };

    const result = filterDictionary(input);

    expect(result).toEqual({
      email: 'user@example.com',
      jobTitle: 'Engineer',
    });
  });

  it('should skip values that are GUIDs', () => {
    const input = {
      crf7f_entra_object_id: '123e4567-e89b-12d3-a456-426614174000', // GUID
      crf7f_email: 'user@example.com',
    };

    const result = filterDictionary(input);

    expect(result).toEqual({
      email: 'user@example.com',
    });
    expect(result.name).toBeUndefined();
  });

  it('should recursively clean nested objects', () => {
    const input = {
      crf7f_location: {
        crf7f_email: 'nested@example.com',
        crf7f_jobtitle: 'Nested Engineer',
      },
    };

    const result = filterDictionary(input);

    expect(result).toEqual({
      location: {
        email: 'nested@example.com',
        jobTitle: 'Nested Engineer',
      },
    });
  });

  it('should return keys sorted alphabetically', () => {
    const input = {
      crf7f_jobtitle: 'Engineer',
      crf7f_email: 'user@example.com',
    };

    const result = filterDictionary(input);
    const keys = Object.keys(result);

    expect(keys).toEqual(['email', 'jobTitle']);
  });

  it('should handle empty input gracefully', () => {
    const result = filterDictionary({});
    expect(result).toEqual({});
  });
});
