import { BadRequest } from '../../errors/BadRequest.js';

export function validateSearchCriteria(query) {
  const maxItems = 2000; // Hard cap for returns to limit potential performance issues. Arbitrary number, can be adjusted as needed

  const { location, assetType, serialNumber, isUnassigned } = query;

  // Ensure at least one valid filter exists
  const hasFilters = location || assetType || serialNumber || isUnassigned;

  if (!hasFilters) {
    throw new BadRequest('At least one valid search filter must be provided');
  }

  // Options / settings for possible search criteria
  return {
    filters: {
      location,
      assetType,
      serialNumber,
      isUnassigned,
    },

    limit: maxItems,
  };
}
