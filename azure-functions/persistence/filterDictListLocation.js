import { filterDictionaryLocation } from './filterDictLocation.js';

export function filterDictionaryByListLocation(list) {
  const results = [];
  for (const item of list) {
    const result = filterDictionaryLocation(item);
    results.push(result);
  }
  return results;
}
