import { dataverseCall } from './dataverseCall';
import { NotFoundError } from '../errors/NotFoundError';
import { InternalServerError } from '../errors/InternalServerError';

export async function getLocationByName({ locationname }) {
  const query = `crf7f_fac_asset_ref_locations?$filter=crf7f_name eq '${locationname}'`;
  const response = await dataverseCall({ query, method: 'GET' });

  if (!response?.value) {
    throw new InternalServerError('Dataverse call failed');
  } else if (response.value.length === 0) {
    throw new NotFoundError(`No location found for name: ${locationname}`);
  }

  return response.value[0].crf7f_fac_asset_ref_locationid;
}
