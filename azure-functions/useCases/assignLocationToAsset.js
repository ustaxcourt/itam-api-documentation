import { InternalServerError } from '../errors/InternalServerError.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { assignLocationAsset } from '../persistence/assignAssetLocation.js';
import { getIdOfRowInTableByColumnValue } from '../persistence/getIdOfRowInTableByColumnValue.js';

export async function assignLocationToAsset(assetid, locationid) {
  let locationId;
  let assetId;
  try {
    locationId = await getIdOfRowInTableByColumnValue({
      table: 'crf7f_fac_asset_ref_locations',
      column: 'crf7f_fac_asset_ref_locationid',
      value: locationid,
    });
  } catch (error) {
    console.log(error);
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError
    ) {
      throw error;
    } else {
      throw new NotFoundError('Location ID not found');
    }
  }

  try {
    assetId = await getIdOfRowInTableByColumnValue({
      table: 'crf7f_ois_asset_rela_item_orgs',
      column: 'crf7f_ois_asset_rela_item_orgid',
      value: assetid,
    });
  } catch (error) {
    if (
      error instanceof InternalServerError ||
      error instanceof DataverseTokenError
    ) {
      throw error;
    } else {
      throw new NotFoundError('Asset ID not found');
    }
  }

  await assignLocationAsset(assetId, locationId);
}
