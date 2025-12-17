import { getJobTitleInfo } from './getJobTitleInfo.js';
import { getDataverseJobTitle } from '../persistence/getDataverseJobTitle.js';
import { InternalServerError } from '../errors/InternalServerError.js';
import { DataverseTokenError } from '../errors/DataverseTokenError.js';

jest.mock('../persistence/getDataverseJobTitle.js');

describe('getJobTitleInfo', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  var mockResponseList = {
    '@odata.context':
      'https://org34e9a332.crm.dynamics.com/api/data/v9.2/$metadata#crf7f_ois_job_title_model_types(crf7f_modelmaximum,crf7f_JobTitleAssetType,crf7f_ReferenceModel,crf7f_ReferenceModel(crf7f_name),crf7f_JobTitleAssetType(crf7f_minimumquanitity,crf7f_maximumquantity,crf7f_JobTitle,crf7f_JobTitle(crf7f_title),crf7f_AssetType(crf7f_name)))',
    value: [
      {
        '@odata.etag': 'W/"11145473"',
        'crf7f_modelmaximum@OData.Community.Display.V1.FormattedValue': '3',
        crf7f_modelmaximum: 3,
        crf7f_ois_job_title_model_typeid:
          'cdfc4062-b0da-f011-8544-7c1e52177972',
        crf7f_ReferenceModel: {
          crf7f_name: 'CM568',
          crf7f_ois_asset_ref_modelid: '2a174d9a-69d7-f011-8544-000d3a35fa12',
        },
        crf7f_JobTitleAssetType: {
          crf7f_ois_job_title_asset_typeid:
            'bb954b00-afda-f011-8544-7c1e52177a24',
          'crf7f_maximumquantity@OData.Community.Display.V1.FormattedValue':
            '8',
          crf7f_maximumquantity: 8,
          'crf7f_minimumquanitity@OData.Community.Display.V1.FormattedValue':
            '4',
          crf7f_minimumquanitity: 4,
          crf7f_JobTitle: {
            crf7f_title: 'Administrative Specialist',
            crf7f_ois_job_titleid: 'b09cf686-30d5-f011-8544-7c1e52177972',
          },
          crf7f_AssetType: {
            crf7f_ois_asset_ref_typeid: 'ac40809b-69d7-f011-8544-000d3a5b5036',
            crf7f_name: 'Docking Station',
          },
        },
      },
      {
        '@odata.etag': 'W/"11145470"',
        'crf7f_modelmaximum@OData.Community.Display.V1.FormattedValue': '2',
        crf7f_modelmaximum: 2,
        crf7f_ois_job_title_model_typeid:
          '1b4579cc-f9d9-f011-8544-7c1e52177a24',
        crf7f_ReferenceModel: {
          crf7f_name: '727pm',
          crf7f_ois_asset_ref_modelid: '0f174d9a-69d7-f011-8544-000d3a35fa12',
        },
        crf7f_JobTitleAssetType: {
          crf7f_ois_job_title_asset_typeid:
            '174193a8-f9d9-f011-8544-7c1e52177a24',
          'crf7f_maximumquantity@OData.Community.Display.V1.FormattedValue':
            '2',
          crf7f_maximumquantity: 2,
          'crf7f_minimumquanitity@OData.Community.Display.V1.FormattedValue':
            '3',
          crf7f_minimumquanitity: 3,
          crf7f_JobTitle: {
            crf7f_title: 'Administrative Specialist',
            crf7f_ois_job_titleid: 'b09cf686-30d5-f011-8544-7c1e52177972',
          },
          crf7f_AssetType: {
            crf7f_ois_asset_ref_typeid: 'b540809b-69d7-f011-8544-000d3a5b5036',
            crf7f_name: 'Laptop',
          },
        },
      },
      {
        '@odata.etag': 'W/"11141663"',
        'crf7f_modelmaximum@OData.Community.Display.V1.FormattedValue': '1',
        crf7f_modelmaximum: 1,
        crf7f_ois_job_title_model_typeid:
          '3cf14ac6-f9d9-f011-8543-7c1e5257cc91',
        crf7f_ReferenceModel: {
          crf7f_name: '22U Open Framer Server Rack',
          crf7f_ois_asset_ref_modelid: '2e174d9a-69d7-f011-8544-000d3a35fa12',
        },
        crf7f_JobTitleAssetType: {
          crf7f_ois_job_title_asset_typeid:
            '174193a8-f9d9-f011-8544-7c1e52177a24',
          'crf7f_maximumquantity@OData.Community.Display.V1.FormattedValue':
            '2',
          crf7f_maximumquantity: 2,
          'crf7f_minimumquanitity@OData.Community.Display.V1.FormattedValue':
            '3',
          crf7f_minimumquanitity: 3,
          crf7f_JobTitle: {
            crf7f_title: 'Administrative Specialist',
            crf7f_ois_job_titleid: 'b09cf686-30d5-f011-8544-7c1e52177972',
          },
          crf7f_AssetType: {
            crf7f_ois_asset_ref_typeid: 'b540809b-69d7-f011-8544-000d3a5b5036',
            crf7f_name: 'Laptop',
          },
        },
      },
    ],
  };

  var mockResponseItem = {
    '@odata.context':
      'https://org34e9a332.crm.dynamics.com/api/data/v9.2/$metadata#crf7f_ois_job_title_model_types(crf7f_modelmaximum,crf7f_JobTitleAssetType,crf7f_ReferenceModel,crf7f_ReferenceModel(crf7f_name),crf7f_JobTitleAssetType(crf7f_minimumquanitity,crf7f_maximumquantity,crf7f_JobTitle,crf7f_JobTitle(crf7f_title),crf7f_AssetType(crf7f_name)))',
    value: [
      {
        '@odata.etag': 'W/"11141663"',
        'crf7f_modelmaximum@OData.Community.Display.V1.FormattedValue': '1',
        crf7f_modelmaximum: 1,
        crf7f_ois_job_title_model_typeid:
          '3cf14ac6-f9d9-f011-8543-7c1e5257cc91',
        crf7f_ReferenceModel: {
          crf7f_name: '22U Open Framer Server Rack',
          crf7f_ois_asset_ref_modelid: '2e174d9a-69d7-f011-8544-000d3a35fa12',
        },
        crf7f_JobTitleAssetType: {
          crf7f_ois_job_title_asset_typeid:
            '174193a8-f9d9-f011-8544-7c1e52177a24',
          'crf7f_maximumquantity@OData.Community.Display.V1.FormattedValue':
            '2',
          crf7f_maximumquantity: 2,
          'crf7f_minimumquanitity@OData.Community.Display.V1.FormattedValue':
            '3',
          crf7f_minimumquanitity: 3,
          crf7f_JobTitle: {
            crf7f_title: 'Administrative Specialist',
            crf7f_ois_job_titleid: 'b09cf686-30d5-f011-8544-7c1e52177972',
          },
          crf7f_AssetType: {
            crf7f_ois_asset_ref_typeid: 'b540809b-69d7-f011-8544-000d3a5b5036',
            crf7f_name: 'Laptop',
          },
        },
      },
    ],
  };

  it('should return restructured job titles when response has mutiple items', async () => {
    getDataverseJobTitle.mockResolvedValue(mockResponseList);
    const result = await getJobTitleInfo('title123');
    expect(getDataverseJobTitle).toHaveBeenCalledWith('title123');

    expect(result).toEqual({
      JobTitle: 'Administrative Specialist',
      requiredItems: [
        {
          assetType: 'Docking Station',
          minimumQuantity: 4,
          maximumQuantity: 8,
          items: [
            {
              itemName: 'CM568',
              itemMaximum: 3,
            },
          ],
        },
        {
          assetType: 'Laptop',
          minimumQuantity: 3,
          maximumQuantity: 2,
          items: [
            {
              itemName: '727pm',
              itemMaximum: 2,
            },
            {
              itemName: '22U Open Framer Server Rack',
              itemMaximum: 1,
            },
          ],
        },
      ],
    });
  });

  it('should return restructured job titles when response contains on item', async () => {
    getDataverseJobTitle.mockResolvedValue(mockResponseItem);
    const result = await getJobTitleInfo('title123');
    expect(getDataverseJobTitle).toHaveBeenCalledWith('title123');

    expect(result).toEqual({
      JobTitle: 'Administrative Specialist',
      requiredItems: [
        {
          assetType: 'Laptop',
          minimumQuantity: 3,
          maximumQuantity: 2,
          items: [
            {
              itemName: '22U Open Framer Server Rack',
              itemMaximum: 1,
            },
          ],
        },
      ],
    });
  });

  it('should rethrow DataverseTokenError', async () => {
    const error = new DataverseTokenError('Token expired');
    getDataverseJobTitle.mockRejectedValue(error);

    await expect(getJobTitleInfo('title789')).rejects.toThrow(
      DataverseTokenError,
    );
    expect(getDataverseJobTitle).toHaveBeenCalledWith('title789');
  });

  it('should rethrow InternalServerError', async () => {
    const error = new InternalServerError('Internal Server Error');
    getDataverseJobTitle.mockRejectedValue(error);

    await expect(getJobTitleInfo('title789')).rejects.toThrow(
      InternalServerError,
    );
    expect(getDataverseJobTitle).toHaveBeenCalledWith('title789');
  });

  it('should throw InternalServerError for unexpected errors', async () => {
    const error = new Error('Unknown failure');
    getDataverseJobTitle.mockRejectedValue(error);
    await expect(getJobTitleInfo('title999')).rejects.toThrow(
      InternalServerError,
    );
    expect(getDataverseJobTitle).toHaveBeenCalledWith('title999');
  });
});
