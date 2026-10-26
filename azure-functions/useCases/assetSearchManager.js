import { filteredSearch } from '../persistence/filteredSearch.js';
import { filterDictionaryByList } from '../persistence/filterDictbyList.js';
import { getLocationById } from '../persistence/getLocationById.js';
import { validateSearchCriteria } from './helpers/validateSearchCriteria.js';

export async function assetSearchManager(queryObject) {
  // This use case is checking to see if the query parameters are valid (parameters and syntax wise) and then transforming them into a criteria object that the assetSearchManager can use to query the database
  const criteria = validateSearchCriteria(queryObject);
  // Validating location ID provided if applicable - returns 404 if specified location does not exist
  // The NotFoundError that is thrown is from dataverseCall and gets caught by the API Controller for the search endpoint
  // We can catch and rethrow here to add additional error message context - return message for now is: Resource not found
  if (criteria.filters.location) {
    await getLocationById(criteria.filters.location);
  }

  const result = await filteredSearch(criteria);
  const assets = filterDictionaryByList(result.items);

  return {
    total: assets.length,
    data: assets,
  };
}
