export function parseDataverseResponse({ data, schema }) {
  const result = {};

  for (const [key, path] of Object.entries(schema)) {
    result[key] = path.split('.').reduce((acc, part) => acc && acc[part], data);
  }

  return result;
}
