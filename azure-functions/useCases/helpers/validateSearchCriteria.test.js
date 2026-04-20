import { validateSearchCriteria } from './validateSearchCriteria.js';
import { BadRequest } from '../../errors/BadRequest.js';

describe('validateSearchCriteria', () => {
  test('returns criteria with serialNumber filter only', () => {
    const query = {
      serialNumber: '123456',
    };

    const result = validateSearchCriteria(query);

    expect(result).toEqual({
      filters: {
        location: undefined,
        assetType: undefined,
        serialNumber: '123456',
        isUnassigned: undefined,
      },
      limit: 2000,
    });
  });

  test('returns criteria with location filter only', () => {
    const query = {
      location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
    };

    const result = validateSearchCriteria(query);

    expect(result.filters).toEqual({
      location: query.location,
      assetType: undefined,
      serialNumber: undefined,
      isUnassigned: undefined,
    });
    expect(result.limit).toBe(2000);
  });

  test('returns criteria with isUnassigned filter only', () => {
    const query = {
      isUnassigned: 'true',
    };

    const result = validateSearchCriteria(query);

    expect(result.filters).toEqual({
      location: undefined,
      assetType: undefined,
      serialNumber: undefined,
      isUnassigned: 'true',
    });
    expect(result.limit).toBe(2000);
  });

  test('returns criteria with multiple filters', () => {
    const query = {
      location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      serialNumber: 'ABC123',
    };

    const result = validateSearchCriteria(query);

    expect(result.filters).toEqual({
      location: 'aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee',
      assetType: undefined,
      serialNumber: 'ABC123',
      isUnassigned: undefined,
    });
  });

  test('sets isUnassigned to false when flag is set to "false"', () => {
    const query = {
      isUnassigned: 'false',
    };

    const result = validateSearchCriteria(query);

    expect(result.filters).toEqual({
      location: undefined,
      assetType: undefined,
      serialNumber: undefined,
      isUnassigned: 'false',
    });
  });

  test('throws BadRequest when no valid filters are provided', () => {
    const query = {};

    expect(() => validateSearchCriteria(query)).toThrow(BadRequest);
    expect(() => validateSearchCriteria(query)).toThrow(
      'At least one valid search filter must be provided',
    );
  });

  test('ignores unknown query parameters', () => {
    const query = {
      serialNumber: '123456',
      nonsense: 'blah',
      trackingId: 'xyz',
    };

    const result = validateSearchCriteria(query);

    expect(result.filters.serialNumber).toBe('123456');
    expect(result.filters).not.toHaveProperty('nonsense');
    expect(result.filters).not.toHaveProperty('trackingId');
  });
});
