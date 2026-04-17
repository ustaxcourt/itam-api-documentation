import { dataverseCall } from '../persistence/dataverseCall.js';

export async function filteredSearch(criteria) {
  const clauses = [];

  if (criteria.filters.location) {
    clauses.push(
      `_crf7f_fac_asset_ref_location_lookup_value eq ${criteria.filters.location}`, // Location - GUID based.
    );
  }
  /*
  if (criteria.filters.type) {
    clauses.push(`crf7f_asset_type eq '${criteria.filters.type}'`);
  }
    */

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
