import { getLocations } from '../persistence/getLocations.js';

export async function locationsWrapper() {
  return await getLocations();
}
