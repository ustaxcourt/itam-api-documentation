import { filteredSearch } from '../persistence/filteredSearch.js';
import { filterDictionaryByList } from '../persistence/filterDictbyList.js';
import { getLocationById } from '../persistence/getLocationById.js';

export async function assetSearchManager(searchCriteria) {
  // Validating location ID provided if applicable - returns 404 if specified location does not exist
  // The NotFoundError that is thrown is from dataverseCall and gets caught by the API Controller for the search endpoint
  // We can catch and rethrow here to add additional error message context - return message for now is: Resource not found
  if (searchCriteria.filters.location) {
    await getLocationById(searchCriteria.filters.location);
  }

  const result = await filteredSearch(searchCriteria);
  const assets = filterDictionaryByList(result.items);

  return {
    total: assets.length,
    data: assets,
  };
}
