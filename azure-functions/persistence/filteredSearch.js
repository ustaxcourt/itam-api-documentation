import { NotFoundError } from '../errors/NotFoundError.js';
import { dataverseCall } from '../persistence/dataverseCall.js';
import { filterModelsByAssetType } from './filterModelsByAssetType.js';
import { getAssetTypeIdByName } from './getAssetTypeIdByName.js';

function buildLookupOrFilter(lookupField, ids) {
  return ids.map(id => `${lookupField} eq ${id}`).join(' or ');
}

export async function filteredSearch(criteria) {
  const clauses = [];

  if (criteria.filters.location) {
    clauses.push(
      `_crf7f_fac_asset_ref_location_lookup_value eq ${criteria.filters.location}`, // Location - GUID based.
    );
  }

  if (criteria.filters.assetType) {
    const assetTypeId = await getAssetTypeIdByName(criteria.filters.assetType);
    console.log(
      'Asset Type ID for type name',
      criteria.filters.assetType,
      'is',
      assetTypeId,
    ); // Testing!

    if (!assetTypeId) {
      throw new NotFoundError(
        `No asset type found matching name: ${criteria.filters.assetType}`,
      );
    }

    const modelIds = await filterModelsByAssetType(assetTypeId);

    // If no models match the type, return empty result early
    if (!modelIds.length) {
      return { items: [] };
    }

    const modelFilter = buildLookupOrFilter(
      '_crf7f_ois_asset_ref_model_lookup_value',
      modelIds,
    );

    clauses.push(`(${modelFilter})`);
  }

  // Using choice field for asset status, goes off a status of "Available", which is encoded as 1 in the Dataverse Choice column
  if (criteria.filters.isUnassigned === 'true') {
    clauses.push(`crf7f_asset_item_status eq 1`); // Unassigned/Available status in the enum/choice field
  }

  if (criteria.filters.isUnassigned === 'false') {
    clauses.push(`crf7f_asset_item_status eq 0`); // Assigned is false. Mapped to assigned status
  }

  if (criteria.filters.serialNumber) {
    clauses.push(`crf7f_serial_number eq '${criteria.filters.serialNumber}'`);
  }

  // We exclude decommissioned assets from search results, decommissioned can be either set to false or null
  // null in cases where field is cleared or line item was created before implementation of decommissioned functionality
  clauses.push(
    `(crf7f_decommissioned eq false or crf7f_decommissioned eq null)`,
  );

  const filterQuery = clauses.join(' and ');

  const url =
    'crf7f_ois_assetses' +
    `?$filter=${filterQuery}` +
    `&$orderby=crf7f_name asc` +
    `&$top=${criteria.limit}`;

  const data = await dataverseCall({
    query: url,
    method: 'GET',
  });

  return {
    items: data.value,
  };
}
