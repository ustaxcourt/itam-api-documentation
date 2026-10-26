import { dataverseCall } from './dataverseCall.js';

export async function filterModelsByAssetType(assetTypeId) {
  const url =
    'crf7f_ois_asset_ref_models' +
    '?$select=crf7f_ois_asset_ref_modelid' +
    `&$filter=_crf7f_ois_asset_ref_typelookup_value eq ${assetTypeId}`;

  const data = await dataverseCall({
    query: url,
    method: 'GET',
  });

  return data.value.map(m => m.crf7f_ois_asset_ref_modelid);
}
