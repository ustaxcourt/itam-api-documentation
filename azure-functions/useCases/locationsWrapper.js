import { getLocations } from '../persistence/getLocations';
export async function locationsWrapper() {
  return await getLocations();
}
