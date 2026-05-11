import { dataverseCall } from './dataverseCall.js';
import { filterDictionaryByList } from './filterDictbyList.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function getLocations() {
  // Build Dataverse query URL - going to be using locations table here
  const query = 'query for locations to be built soon';

  // Dataverse call to get locations ...
  const response = await dataverseCall({ query: query, method: 'GET' });
  if (!response?.value || response.value.length === 0) {
    throw new NotFoundError(`No locations found`);
  }
  // Normalize data - placeholder method here until we build out the shape and methods for location formatting. Own versions of these filter / dictionary methods for location components
  return filterDictionaryByList(response.value);
}
