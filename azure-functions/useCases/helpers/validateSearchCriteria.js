import { BadRequest } from '../../errors/BadRequest.js';

export function validateSearchCriteria(query) {
  const maxItems = 2000; // Hard cap for returns to limit potential performance issues. Arbitrary number, can be adjusted as needed

  const { location, type, serialNumber, isUnassigned } = query;

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
      isUnassigned,
    },

    limit: maxItems,
  };
}
