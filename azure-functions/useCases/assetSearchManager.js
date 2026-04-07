import { filteredSearch } from '../persistence/filteredSearch.js';
import { filterDictionaryByList } from '../persistence/filterDictbyList.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function assetSearchManager(searchCriteria) {
  const result = await filteredSearch(searchCriteria);

  if (!result?.items?.length) {
    throw new NotFoundError('No assets found matching search criteria');
  }

  const assets = filterDictionaryByList(result.items);

  return {
    total: assets.length,
    data: assets,
    continuationToken: result.continuationToken ?? null,
  };
}
