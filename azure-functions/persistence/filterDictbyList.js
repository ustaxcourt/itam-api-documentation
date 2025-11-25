import { filterDictionary } from './filterDict.js';

export function filterDictionaryByList(list) {
  const results = [];
  for (const item of list) {
    const result = filterDictionary(item);
    results.push(result);
  }
  return results;
}
