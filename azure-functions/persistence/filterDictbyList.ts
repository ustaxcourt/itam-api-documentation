import { filterDictionary } from './filterDict.js';

// T is a generic which we know must extend Record as that's what FilterDictionary returns
// We can narrow the types for input and output if needed
export function filterDictionaryByList<T extends Record<string, unknown>>(
  list: T[],
): T[] {
  const results: T[] = [];
  for (const item of list) {
    const result = filterDictionary(item) as T;
    results.push(result);
  }
  return results;
}
