export async function reorderResponseObject(data, expectedSchema) {
  const result = {};

  for (const [key, path] of Object.entries(expectedSchema)) {
    result[key] = path.split('.').reduce((acc, part) => acc && acc[part], data);
  }

  return result;
}
