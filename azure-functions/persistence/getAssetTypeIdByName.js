import { dataverseCall } from './dataverseCall.js';

export async function getAssetTypeIdByName(typeName) {
  if (!typeName) return null;

  const url =
    'crf7f_ois_asset_ref_types' +
    '?$select=crf7f_ois_asset_ref_typeid' +
    `&$filter=crf7f_name eq '${typeName}'`;

  const data = await dataverseCall({
    query: url,
    method: 'GET',
  });

  // We assume that asset type names are unique. If there are no matches, we return null
  return data.value.length ? data.value[0].crf7f_ois_asset_ref_typeid : null;
}
