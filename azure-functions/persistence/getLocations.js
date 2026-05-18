import { dataverseCall } from './dataverseCall.js';
import { filterDictionaryByListLocation } from './filterDictListLocation.js';
import { NotFoundError } from '../errors/NotFoundError.js';

export async function getLocations() {
  // Build Dataverse query URL - using locations table here
  const query = 'crf7f_fac_asset_ref_locations';

  // Dataverse call to get locations
  const response = await dataverseCall({ query: query, method: 'GET' });
  if (!response?.value || response.value.length === 0) {
    throw new NotFoundError(`No locations found`);
  }
  // Normalize data
  return filterDictionaryByListLocation(response.value);
}
