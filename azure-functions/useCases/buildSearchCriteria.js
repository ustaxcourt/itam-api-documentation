import { BadRequest } from '../errors/BadRequest.js';

export function buildSearchCriteria(query) {
  const {
    location,
    type,
    serialNumber,
    // Unassigned is a presence-only flag, so we don't pull it from the query in the same way as the others

    sortBy = 'crf7f_name',
    sortDir = 'asc',

    page = 1,
    pageSize = 25,
  } = query;

  // Normalize paging - for when the data renders
  const normalizedPage = Number(page);
  const normalizedPageSize = Number(pageSize);

  if (!Number.isInteger(normalizedPage) || normalizedPage < 1) {
    throw new BadRequest('page must be a positive integer');
  }

  if (
    !Number.isInteger(normalizedPageSize) ||
    normalizedPageSize < 1 ||
    normalizedPageSize > 100
  ) {
    throw new BadRequest('pageSize must be between 1 and 100');
  }

  // Normalize sorting - for when the data renders
  const direction = sortDir.toLowerCase();
  if (!['asc', 'desc'].includes(direction)) {
    throw new BadRequest('sortDir must be "asc" or "desc"');
  }

  // Presence only unassigned flag - if present, true, if not, false
  const isUnassigned = 'unassigned' in query;

  // Ensure at least one filter exists
  const hasFilters = location || type || serialNumber || isUnassigned;

  if (!hasFilters) {
    throw new BadRequest('At least one search filter must be provided');
  }

  // Options for possible search criteria
  return {
    filters: {
      location,
      type,
      serialNumber,
      unassigned: isUnassigned,
    },

    sort: {
      field: sortBy,
      direction,
    },

    paging: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
    },
  };
}
