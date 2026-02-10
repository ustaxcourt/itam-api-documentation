import { dataverseCall } from './dataverseCall.js';
import { InternalServerError } from '../errors/InternalServerError.js';

export async function updateAssetCondition(assetId, conditionCode) {
  if (!assetId) {
    throw new InternalServerError('Missing assetId (record GUID)');
  }
  // Dataverse Choice column stores integer values
  if (typeof conditionCode !== 'number') {
    throw new InternalServerError(
      'Condition code for a Choice column must be a number',
    );
  }

  const query = `crf7f_ois_asset_rela_item_orgs(${assetId})`;

  await dataverseCall({
    query,
    method: 'PATCH',
    body: { crf7f_asset_item_condition: conditionCode },
  });

  // If dataverseCall doesn't throw, successful update, return void.
}
