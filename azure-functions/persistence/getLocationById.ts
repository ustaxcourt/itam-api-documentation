import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';

//This is used to describe the minimal structure expected back
//EG it contains a location id, it could have other stuff but we don't care
type DataverseLocationRecord = {
  crf7f_fac_asset_ref_locationid: string;
};

type DataverseResponse<T> = {
  value?: T[];
};

export async function getLocationById(locationid: string): Promise<string> {
  const query = `crf7f_fac_asset_ref_locations?$filter=crf7f_fac_asset_ref_locationid eq '${locationid}'`;
  const response = (await dataverseCall({
    query,
    method: 'GET',
  })) as DataverseResponse<DataverseLocationRecord>;
  if (!response?.value) {
    throw new InternalServerError('Dataverse call failed');
  } else if (response.value.length === 0) {
    throw new NotFoundError(`No location found for ID: ${locationid}`);
  }

  return response.value[0].crf7f_fac_asset_ref_locationid;
}
