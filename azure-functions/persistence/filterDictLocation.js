export function filterDictionaryLocation(dict) {
  const cleaned = {};
  const guidRegex =
    /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

  const keyMap = {
    crf7f_name: 'assetLocationName',
    crf7f_fac_asset_ref_locationid: 'guid',
    'crf7f_fac_asset_ref_locationId@OData.Community.Display.V1.FormattedValue':
      'guidFormatted',
    crf7f_chambers_name: 'chambersName',
    crf7f_location_type: 'locationType',
    crf7f_office_name: 'officeName',
  };

  for (const key in dict) {
    if (!(key in keyMap)) continue;

    const value = dict[key];

    if (typeof value === 'string' && guidRegex.test(value)) continue;

    const prettyKey = keyMap[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      cleaned[prettyKey] = filterDictionaryLocation(value);
    } else {
      cleaned[prettyKey] = value;
    }
  }

  const sortedCleaned = Object.keys(cleaned)
    .sort()
    .reduce((acc, key) => {
      acc[key] = cleaned[key];
      return acc;
    }, {});

  return sortedCleaned;
}
