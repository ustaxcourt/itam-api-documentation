import { dataverseCall } from '../persistence/dataverseCall';

export async function unassignAssetOwner(assetId) {
  const body = {
    'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': null,
    crf7f_asset_item_status: 1,
  };

  const query = `crf7f_ois_asset_rela_item_orgs(${assetId})`;
  await dataverseCall({ query, method: 'PATCH', body });
}
