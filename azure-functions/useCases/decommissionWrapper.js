import { checkUnassigned } from '../persistence/checkUnassigned';
import { decommission } from '../persistence/decommission';

export async function decommissionWrapper(id) {
  const unassigned = await checkUnassigned(id);
  if (unassigned) {
    await decommission(id);
  } else {
    // we are about to throw an error here .. the asset should be unassigned!! Maybe BadRequest
  }
}
