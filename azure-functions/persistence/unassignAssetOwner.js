import { dataverseCall } from '../persistence/dataverseCall.js';

export async function unassignAssetOwner(assetId) {
  const { DATAVERSE_URL } = process.env;

  const body = {
    'crf7f_ois_asset_entra_dat_userCurrentOw@odata.bind': null,
    crf7f_asset_item_status: 1,
  };

  const url = `${DATAVERSE_URL}/api/data/v9.2/crf7f_ois_asset_rela_item_orgs(${assetId})`;
  await dataverseCall(url, 'PATCH', body);
}
