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
    // this will be for the choice field for asset status - logic pending either available only or not assigned.
    if (criteria.filters.unassigned) {
    clauses.push(`crf7f_asset_status eq <UNASSIGNED_CHOICE_VALUE>`);
  }
  */
  if (criteria.filters.serialNumber) {
    clauses.push(`crf7f_serial_number eq '${criteria.filters.serialNumber}'`);
  }

  // Added protection – buildSearchCriteria should already enforce this
  if (!clauses.length) {
    throw new Error('No valid filters provided for asset search');
  }

  const filterQuery = clauses.join(' and ');

  let url;

  if (criteria.paging.continuationToken) {
    url = criteria.paging.continuationToken;
  } else {
    url =
      'crf7f_ois_assetses' +
      `?$filter=${filterQuery}` +
      `&$orderby=${criteria.sort.field} ${criteria.sort.direction}` +
      `&$top=${criteria.paging.pageSize}`;
  }

  const data = await dataverseCall({
    query: url,
    method: 'GET',
  });

  return {
    items: data.value,
    continuationToken: data['@odata.nextLink'] ?? null,
  };
}
