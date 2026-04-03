import { filteredSearch } from '../persistence/filteredSearch.js';

export async function assetSearchManager(searchCriteria) {
  // Building out - will return final list of assets in alphabetical order by name and paging
  return await filteredSearch(searchCriteria);
}
