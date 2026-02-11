import { dataverseCall } from '../persistence/dataverseCall.js';

export async function unassignAssetOwner(assetId) {
  const body = {
    'crf7f_userCurrentOwnerLookup@odata.bind': null,
    crf7f_asset_item_status: 1,
  };

  const query = `crf7f_ois_assetses(${assetId})`;
  await dataverseCall({ query, method: 'PATCH', body });
}
