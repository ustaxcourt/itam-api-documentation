import { DataverseTokenError } from '../errors/DataverseTokenError.js';
import { getJobTitleNameById } from '../persistence/getJobTitleNameById.js';
import { getJobTitleRequirementsById } from '../persistence/getJobTitleRequirementsById.js';
import { getJobTitleRequirementsInteractor } from './getJobTitleRequirementsInteractor.js';
import { InternalServerError } from '../errors/InternalServerError.js';

jest.mock('../persistence/getJobTitleRequirementsById.js');
jest.mock('../persistence/getJobTitleNameById.js');

const mockResponseList = [
  {
    assetType: 'Docking Station',
    minimumQuantity: 4,
    maximumQuantity: 8,
    items: [
      {
        modelName: 'CM568',
        modelMaximum: 3,
        modelMinimum: 0,
      },
    ],
  },
  {
    assetType: 'Laptop',
    minimumQuantity: 3,
    maximumQuantity: 2,
    items: [
      {
        modelName: '727pm',
        modelMaximum: 2,
        modelMinimum: 0,
      },
      {
        modelName: '22U Open Framer Server Rack',
        modelMaximum: 1,
        modelMinimum: 0,
      },
    ],
  },
];

describe('getJobTitleRequirementsInteractor', () => {
  beforeEach(() => {
    getJobTitleRequirementsById.mockResolvedValue(mockResponseList);
    getJobTitleNameById.mockResolvedValue('Administrative Specialist');
  });

  it('should fetch the job title from persistence', async () => {
    const result = await getJobTitleRequirementsInteractor('title123');
    expect(getJobTitleNameById).toHaveBeenCalledWith('title123');
    expect(result.jobTitle).toBe('Administrative Specialist');
  });

  it('should fetch the requirements from persistence', async () => {
    const result = await getJobTitleRequirementsInteractor('title123');
    expect(getJobTitleRequirementsById).toHaveBeenCalledWith('title123');
    expect(result.requiredAssets).toEqual([
      {
        assetType: 'Docking Station',
        minimumQuantity: 4,
        maximumQuantity: 8,
        items: [
          {
            modelName: 'CM568',
            modelMaximum: 3,
            modelMinimum: 0,
          },
        ],
      },
      {
        assetType: 'Laptop',
        minimumQuantity: 3,
        maximumQuantity: 2,
        items: [
          {
            modelName: '727pm',
            modelMaximum: 2,
            modelMinimum: 0,
          },
          {
            modelName: '22U Open Framer Server Rack',
            modelMaximum: 1,
            modelMinimum: 0,
          },
        ],
      },
    ]);
  });

  it('should rethrow DataverseTokenError', async () => {
    const error = new DataverseTokenError('Token expired');
    getJobTitleRequirementsById.mockRejectedValue(error);

    await expect(getJobTitleRequirementsInteractor('title789')).rejects.toThrow(
      DataverseTokenError,
    );
    expect(getJobTitleRequirementsById).toHaveBeenCalledWith('title789');
  });

  it('should rethrow InternalServerError', async () => {
    const error = new InternalServerError('Internal Server Error');
    getJobTitleRequirementsById.mockRejectedValue(error);

    await expect(getJobTitleRequirementsInteractor('title789')).rejects.toThrow(
      InternalServerError,
    );
    expect(getJobTitleRequirementsById).toHaveBeenCalledWith('title789');
  });

  it('should throw InternalServerError for unexpected errors', async () => {
    const error = new Error('Unknown failure');
    getJobTitleRequirementsById.mockRejectedValue(error);
    await expect(getJobTitleRequirementsInteractor('title999')).rejects.toThrow(
      InternalServerError,
    );
    expect(getJobTitleRequirementsById).toHaveBeenCalledWith('title999');
  });
});
