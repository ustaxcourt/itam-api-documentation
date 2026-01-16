export function mockHeaders(headers = {}) {
  return {
    forEach(callback) {
      Object.entries(headers).forEach(([key, value]) => callback(value, key));
    },
    get(key) {
      return headers[key.toLowerCase()] || headers[key];
    },
  };
}

//Creates a mock fetch response with headers and JSON
export function createFetchResponse({
  ok = true,
  status = 200,
  json = {},
  headers = {},
} = {}) {
  return {
    ok,
    status,
    json: async () => json,
    headers: mockHeaders(headers),
  };
}
