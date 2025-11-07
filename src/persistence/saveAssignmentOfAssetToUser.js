import { patchDatabase } from './dataverse/patchDatabase.js';

export async function saveAssignmentOfAssetToUser({ userId, assetId }) {
  const query = {
    'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': `crf7f_ois_asset_entra_dat_users(${userId})`,
    crf7f_asset_item_status: 0,
  };

  await patchDatabase({
    table: `crf7f_ois_asset_rela_item_orgs(${assetId})`,
    query,
  });
}
