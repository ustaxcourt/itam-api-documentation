import { queryAssetsByEmail } from './queryAssetsByEmail';
import { getAssetsByEmail } from '../useCases/getAssetsByEmail';
import { InternalServerError } from '../errors/InternalServerError';

jest.mock('../useCases/getAssetsByEmail.js');
jest.mock('../persistence/dataverseCall.js');

describe('queryAssetsByEmail', () => {
  const testEmail = 'test@test.test';
  const testArray = [
    { assetName: 'test1', user: { email: 'test@test.test' } },
    { assetName: 'test2', user: { email: 'test@test.test' } },
  ];
  const request = { params: { email: testEmail } };
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns a 200 success and assets if email has assigned assets', async () => {
    getAssetsByEmail.mockResolvedValue(testArray);

    const result = await queryAssetsByEmail(request);

    expect(getAssetsByEmail).toHaveBeenCalledWith(testEmail);

    expect(result.status).toBe(200);
    expect(result.jsonBody).toEqual({
      message: 'Success',
      data: [
        { assetName: 'test1', user: { email: 'test@test.test' } },
        { assetName: 'test2', user: { email: 'test@test.test' } },
      ],
    });
  });

  it('still returns a success response when no assets are found', async () => {
    getAssetsByEmail.mockResolvedValue([]);

    const result = await queryAssetsByEmail(request);
    expect(result.status).toBe(200);
    expect(result.jsonBody).toEqual({ message: 'Success', data: [] });
  });

  it('returns InternalServerError response when thrown by dataverseCall', async () => {
    const error = new InternalServerError('DATAVERSE_URL is missing');
    getAssetsByEmail.mockRejectedValue(error);

    const result = await queryAssetsByEmail(request);
    expect(result.status).toBe(500);
    expect(result.jsonBody.message).toBe('DATAVERSE_URL is missing');
  });

  it('returns generic error response when encountered', async () => {
    const error = new Error('Something went wrong!');
    getAssetsByEmail.mockRejectedValue(error);

    const result = await queryAssetsByEmail(request);
    expect(result.status).toBe(500);
    expect(result.jsonBody.message).toBe('Something went wrong!');
  });
});
