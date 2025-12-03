import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { unassignLocationAsset } from '../persistence/unassignAssetLocation.js';
import { getAssetByID } from '../persistence/getAssetByID.js';

export async function unassignLocationToAsset(assetid) {
  try {
    await getAssetByID(assetid);
  } catch (error) {
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError ||
      error instanceof NotFoundError
    ) {
      throw error;
    } else {
      throw new InternalServerError('Server Error');
    }
  }
  await unassignLocationAsset(assetid);
}
