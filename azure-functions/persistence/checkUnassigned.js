import { NotFoundError } from '../errors/NotFoundError';
import { getAssetByID } from './getAssetByID';
import { InternalServerError } from '../errors/InternalServerError';

export async function checkUnassigned(id) {
  try {
    const assetDetails = await getAssetByID(id);

    const userIsBlank =
      assetDetails.user === undefined ||
      assetDetails.user === null ||
      (typeof assetDetails.user === 'string' &&
        assetDetails.user.trim() === '') ||
      (typeof assetDetails.user === 'object' &&
        assetDetails.user !== null &&
        Object.keys(assetDetails.user).length === 0);

    return userIsBlank;
  } catch (error) {
    if (error instanceof NotFoundError) {
      throw error;
    }

    throw new InternalServerError(
      `Dataverse asset lookup failed: ${error.message}`,
    );
  }
}
