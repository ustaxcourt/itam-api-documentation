import { BadRequest } from '../../errors/BadRequest.js';

export function validateSearchCriteria(query) {
  const maxItems = 2000; // Hard cap for returns to limit potential performance issues. Arbitrary number, can be adjusted as needed

  const {
    location,
    type,
    serialNumber,
    // Unassigned is a presence-only flag, so we don't pull it (or any value from it) from the query in the same way as the others
  } = query;

  // Presence only unassigned flag - if present, true, if not, false
  const isUnassigned = 'unassigned' in query;

  // Ensure at least one valid filter exists
  const hasFilters = location || type || serialNumber || isUnassigned;

  if (!hasFilters) {
    throw new BadRequest('At least one valid search filter must be provided');
  }

  // Options / settings for possible search criteria
  return {
    filters: {
      location,
      type,
      serialNumber,
      unassigned: isUnassigned,
    },

    limit: maxItems,
  };
}
