export function filterDictionaryLocation(dict) {
  const cleaned = {};

  const keyMap = {
    crf7f_name: 'assetLocationName',
    crf7f_fac_asset_ref_locationid: 'guid',
    crf7f_chambers_name: 'chambersName',
    crf7f_location_type: 'locationType',
    crf7f_office_name: 'officeName',
  };

  for (const key in dict) {
    if (!(key in keyMap)) continue;

    const value = dict[key];

    const prettyKey = keyMap[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      cleaned[prettyKey] = filterDictionaryLocation(value);
    } else {
      cleaned[prettyKey] = value;
    }
  }

  const nameClean = cleaned.assetLocationName || '';
  const chamber = cleaned.chambersName || '';
  const office = cleaned.officeName || '';
  const type = cleaned.locationType || '';

  switch (type) {
    case 'Chambers':
      cleaned.name = `${nameClean} - (Chambers of ${chamber})`;
      break;

    case 'Court Room':
    case 'Field Courthouse':
      cleaned.name = `${nameClean} - ${type}`;
      break;

    default:
      cleaned.name = `${nameClean} - ${office}`;
  }

  const sortedCleaned = Object.keys(cleaned)
    .sort()
    .reduce((acc, key) => {
      acc[key] = cleaned[key];
      return acc;
    }, {});

  return sortedCleaned;
}
