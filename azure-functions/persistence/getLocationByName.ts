import { dataverseCall } from './dataverseCall.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { InternalServerError } from '../errors/InternalServerError.js';

//Similar to getLocationByID, this is the minimal shape expected back
type DataverseLocationRecord = {
  crf7f_fac_asset_ref_locationid: string;
};

type DataverseResponse<T> = {
  value?: T[];
};

//Not sure if locationname needs to be an object? Target for refactor - ZD 29 Dec 2025
export async function getLocationByName({
  locationname,
}: {
  locationname: string;
}): Promise<string> {
  const query = `crf7f_fac_asset_ref_locations?$filter=crf7f_name eq '${locationname}'`;
  const response = (await dataverseCall({
    query,
    method: 'GET',
  })) as DataverseResponse<DataverseLocationRecord>;

  if (!response?.value) {
    throw new InternalServerError('Dataverse call failed');
  } else if (response.value.length === 0) {
    throw new NotFoundError(`No location found for name: ${locationname}`);
  }

  return response.value[0].crf7f_fac_asset_ref_locationid;
}
