import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

import { assignLocationAsset } from '../persistence/assignAssetLocation.js';
import { getLocationById } from '../persistence/getLocationById.js';
import { getAssetByID } from '../persistence/getAssetByID.js';

export async function assignLocationToAsset(assetid, locationid) {
  try {
    await getLocationById(locationid);
  } catch (error) {
    console.log(error);
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
  await assignLocationAsset(assetid, locationid);
}
