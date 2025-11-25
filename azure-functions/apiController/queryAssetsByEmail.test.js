import { queryAssetsByEmail } from './queryAssetsByEmail.js';
import { buildResponse } from './buildResponse.js';
import { getAssetsByEmail } from '../useCases/getAssetsByEmail.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('./buildResponse.js');
jest.mock('../useCases/getAssetsByEmail.js');
jest.mock('../persistence/dataverseCall.js');

describe('queryAssetsByEmail', () => {
  const testEmail = 'test@test.test';
  const testArray = [
    { assetName: 'test1', user: { email: 'test@test.test' } },
    { assetName: 'test2', user: { email: 'test@test.test' } },
  ];
  const request = { params: { email: testEmail } };
  beforeEach(() => jest.clearAllMocks());

  it('returns a 200 success and assets if email has assigned assets', async () => {
    getAssetsByEmail.mockResolvedValue(testArray);
    buildResponse.mockReturnValue({
      status: 200,
      jsonBody: { message: 'Success', data: testArray },
    });

    const result = await queryAssetsByEmail(request);

    expect(getAssetsByEmail).toHaveBeenCalledWith(testEmail);
    expect(buildResponse).toHaveBeenLastCalledWith(200, 'Success', testArray);
    expect(result.status).toBe(200);
    expect(result.jsonBody.message).toBe('Success');
    expect(result.jsonBody.data).toEqual(testArray);
  });

  it('returns NotFoundError response (404) when no assets are found', async () => {
    getAssetsByEmail.mockResolvedValue([]);
    buildResponse.mockReturnValue({
      status: 404,
      jsonBody: { message: `No assets found for provided email: ${testEmail}` },
    });

    const result = await queryAssetsByEmail(request);

    expect(buildResponse).toHaveBeenLastCalledWith(
      404,
      `No assets found for provided email: ${testEmail}`,
    );
    expect(result.status).toBe(404);
    expect(result.jsonBody.message).toBe(
      `No assets found for provided email: ${testEmail}`,
    );
    expect(result.jsonBody.data).toEqual(undefined); // nothing is passed so this should be undef
  });

  it('returns InternalServerError response when thrown by dataverseCall', async () => {
    const error = new InternalServerError('DATAVERSE_URL is missing');

    getAssetsByEmail.mockRejectedValue(error);
    buildResponse.mockReturnValue({
      status: 500,
      jsonBody: { message: error.message },
    });

    const result = await queryAssetsByEmail(request);

    expect(buildResponse).toHaveBeenLastCalledWith(500, error.message);
    expect(result.status).toBe(500);
    expect(result.jsonBody.message).toBe(error.message);
  });

  it('returns generic error response when encountered', async () => {
    const error = new Error('Something went wrong!');

    getAssetsByEmail.mockRejectedValue(error);
    buildResponse.mockReturnValue({
      status: undefined,
      jsonBody: { message: error.message },
    });

    const result = await queryAssetsByEmail(request);

    expect(buildResponse).toHaveBeenLastCalledWith(undefined, error.message);
    expect(result.status).toBeUndefined(); // May be improved with future error handling
    expect(result.jsonBody.message).toBe(error.message);
  });
});
