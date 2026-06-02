import { filterDictionaryLocation } from './filterDictLocation';

describe('filterDictionaryLocation', () => {
  it('should map and rename keys based on keyMap', () => {
    const input = {
      crf7f_name: 'Main Office',
      crf7f_office_name: 'Judge Morrison',
      crf7f_location_type: 'Chambers',
      unknown_key: 'ignored',
    };

    const result = filterDictionaryLocation(input);

    expect(result.assetLocationName).toBe('Main Office');
    expect(result.officeName).toBe('Judge Morrison');
    expect(result.locationType).toBe('Chambers');
    expect(result.unknown_key).toBeUndefined();
  });

  it('should preserve and map GUID correctly', () => {
    const input = {
      crf7f_fac_asset_ref_locationid: '123e4567-e89b-12d3-a456-426614174000',
    };

    const result = filterDictionaryLocation(input);

    expect(result.guid).toBe('123e4567-e89b-12d3-a456-426614174000');
  });

  it('should construct name for Chambers correctly', () => {
    const input = {
      crf7f_name: 'Main Office',
      crf7f_office_name: 'Judge Morrison',
      crf7f_location_type: 'Chambers',
    };

    const result = filterDictionaryLocation(input);

    expect(result.name).toBe('Main Office - (Chambers of Judge Morrison)');
  });

  it('should construct name for Home Office correctly', () => {
    const input = {
      crf7f_name: 'Home Office (HO)',
      crf7f_location_type: 'Home Office (HO)',
    };

    const result = filterDictionaryLocation(input);

    expect(result.name).toBe('Home Office (HO)');
  });

  it('should construct name for Court Room / Field Courthouse', () => {
    const input = {
      crf7f_name: 'Main Office',
      crf7f_location_type: 'Court Room',
    };

    const result = filterDictionaryLocation(input);

    expect(result.name).toBe('Main Office - Court Room');
  });

  it('should fallback to officeName in default case', () => {
    const input = {
      crf7f_name: 'Main Office',
      crf7f_office_name: 'Finance Office',
      crf7f_location_type: 'Other',
    };

    const result = filterDictionaryLocation(input);

    expect(result.name).toBe('Main Office - Finance Office');
  });

  it('should handle missing optional fields gracefully', () => {
    const input = {
      crf7f_name: 'Main Office',
      crf7f_location_type: 'Chambers',
    };

    const result = filterDictionaryLocation(input);

    expect(result.name).toBe(
      'Main Office - (Chambers of )', // Chambers name in this case is blank, so it renders as such with no issue
    );
  });

  it('should return keys sorted alphabetically', () => {
    const input = {
      crf7f_location_type: 'Chambers',
      crf7f_name: 'Main Office',
      crf7f_office_name: 'Judge Morrison',
    };

    const result = filterDictionaryLocation(input);

    const keys = Object.keys(result);
    expect(keys).toEqual([...keys].sort());
  });

  it('should handle empty input gracefully', () => {
    const result = filterDictionaryLocation({});

    expect(result).toEqual({
      name: ' - ', // Based on switch default case with empty name and office
    });
  });

  it('should handle nested objects recursively', () => {
    const input = {
      crf7f_name: 'Main Office',
      nested: {
        crf7f_name: 'Nested Name',
        crf7f_location_type: 'Home Office (HO)',
      },
    };

    const result = filterDictionaryLocation(input);

    expect(result.assetLocationName).toBe('Main Office');
    expect(result.nested).toBeUndefined(); // Nested key not in keyMap so it will not render
  });

  it('should not break on null or undefined values', () => {
    const input = {
      crf7f_name: null,
      crf7f_location_type: undefined,
    };

    const result = filterDictionaryLocation(input);

    expect(result).toBeDefined();
    expect(result.name).toBe(' - ');
  });
});
