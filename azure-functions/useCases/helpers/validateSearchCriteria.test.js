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
        type: undefined,
        serialNumber: '123456',
        unassigned: false,
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
      type: undefined,
      serialNumber: undefined,
      unassigned: false,
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
      type: undefined,
      serialNumber: 'ABC123',
      unassigned: false,
    });
  });

  test('sets unassigned to true when flag is present (presence-only)', () => {
    const query = {
      unassigned: '',
    };

    const result = validateSearchCriteria(query);

    expect(result.filters).toEqual({
      location: undefined,
      type: undefined,
      serialNumber: undefined,
      unassigned: true,
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
