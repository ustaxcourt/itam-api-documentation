import { BadRequest } from '../errors/BadRequest.js';

export function buildSearchCriteria(query) {
  const {
    location,
    type,
    serialNumber,
    // Unassigned is a presence-only flag, so we don't pull it (or any value from it) from the query in the same way as the others

    sortBy = 'crf7f_name',
    sortDir = 'asc',

    pageSize = 25,
    continuationToken = null, // Testing this out. Supposed to be used for Dataverse pagination if needed, but we'll see how it goes with the current implementation
  } = query;

  // Normalize paging - for when the data renders
  const normalizedPageSize = Number(pageSize);

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
    throw new BadRequest('At least one valid search filter must be provided');
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
      pageSize: normalizedPageSize,
      continuationToken, // This can be used for Dataverse pagination if needed
    },
  };
}
