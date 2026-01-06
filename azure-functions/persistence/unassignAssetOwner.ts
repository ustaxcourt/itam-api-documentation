import { dataverseCall } from './dataverseCall.js';

// Promise<unknown> is a placeholder until we better define that response - ZD 30 Dec 2025
export async function unassignAssetOwner(assetId: string): Promise<unknown> {
  const body = {
    'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': null,
    crf7f_asset_item_status: 1,
  };

  const query = `crf7f_ois_asset_rela_item_orgs(${assetId})`;
  //original function awaited the call, matched behavior to assignAssetOwner
  //Also makes TS happier
  return dataverseCall({ query, method: 'PATCH', body });
}
