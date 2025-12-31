//The response object dictates the shape of dict as a Record
//We can lock down a more specific type if needed/desired later.
export function filterDictionary(
  dict: Record<string, unknown>,
): Record<string, unknown> {
  const cleaned: Record<string, unknown> = {};
  const guidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

  const keyMap: Record<string, string> = {
    '_crf7f_ois_asset_dat_itemlookup_value@OData.Community.Display.V1.FormattedValue':
      'assetName',
    '_crf7f_fac_asset_ref_locationlookup_value@OData.Community.Display.V1.FormattedValue':
      'location',
    _crf7f_fac_asset_ref_locationlookup_value: 'location',
    'crf7f_asset_item_status@OData.Community.Display.V1.FormattedValue':
      'itemStatus',
    crf7f_phone_numbers: 'phone',
    'crf7f_asset_item_condition@OData.Community.Display.V1.FormattedValue':
      'condition',
    crf7f_service_activation: 'activation',
    '_crf7f_ois_asset_entra_dat_usercurrentow_value@OData.Community.Display.V1.FormattedValue':
      'user',
    crf7f_os_version: 'osVersion',
    crf7f_ois_asset_entra_dat_userCurrentOw: 'user',
    crf7f_entra_object_id: 'name',
    crf7f_iscontractor: 'isContractor',
    crf7f_isactive: 'isActive',
    crf7f_email: 'email',
    crf7f_jobtitle: 'jobTitle',
    crf7f_phone: 'phone',
    crf7f_location: 'location',
    crf7f_title: 'title',
  };

  for (const key in dict) {
    if (!(key in keyMap)) continue;

    const value = dict[key];

    if (typeof value === 'string' && guidRegex.test(value)) continue;

    const prettyKey = keyMap[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      cleaned[prettyKey] = filterDictionary(value as Record<string, unknown>);
    } else {
      cleaned[prettyKey] = value;
    }
  }

  //Explicitly need to type the shape of reduce otherwise it defaults to {}
  const sortedCleaned = Object.keys(cleaned)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = cleaned[key];
      return acc;
    }, {});

  return sortedCleaned;
}
