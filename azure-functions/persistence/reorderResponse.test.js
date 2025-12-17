import { reorderResponseObject } from './reorderResponse.js'; // Update with actual file name

describe('reorderResponseObject', () => {
  const data = {
    '@odata.etag': 'W/"11137313"',
    'modifiedon@OData.Community.Display.V1.FormattedValue':
      '12/15/2025 9:05 PM',
    modifiedon: '2025-12-15T21:05:21Z',
    _owninguser_value: '0e0c8e0d-2f93-f011-b4cc-6045bdeee418',
    crf7f_ois_job_title_asset_typeid: '174193a8-f9d9-f011-8544-7c1e52177a24',
    '_crf7f_assettype_value@OData.Community.Display.V1.FormattedValue':
      'Laptop',
    _crf7f_assettype_value: 'b540809b-69d7-f011-8544-000d3a5b5036',
    crf7f_minimumquanitity: 3,
    '_crf7f_jobtitle_value@OData.Community.Display.V1.FormattedValue':
      'Administrative Specialist',
    _crf7f_jobtitle_value: 'b09cf686-30d5-f011-8544-7c1e52177972',
    crf7f_maximumquantity: 2,
    crf7f_ReferenceModel: {
      crf7f_name: 'CM568',
    },
    crf7f_JobTitleAssetType: {
      crf7f_minimumquanitity: 3,
      crf7f_maximumquantity: 2,
      crf7f_JobTitle: {
        crf7f_title: 'Administrative Specialist',
      },
      crf7f_AssetType: {
        crf7f_name: 'Laptop',
      },
    },
    crf7f_modelmaximum: 1,
  };

  const responseExpectation = {
    itemName: 'crf7f_ReferenceModel.crf7f_name',
    minimumQuantity: 'crf7f_JobTitleAssetType.crf7f_minimumquanitity',
    maximumQuantity: 'crf7f_JobTitleAssetType.crf7f_maximumquantity',
    jobTitle: 'crf7f_JobTitleAssetType.crf7f_JobTitle.crf7f_title',
    assetType: 'crf7f_JobTitleAssetType.crf7f_AssetType.crf7f_name',
    modelMaximum: 'crf7f_modelmaximum',
  };

  it('should map nested data to expected schema correctly', async () => {
    const expected = {
      itemName: 'CM568',
      minimumQuantity: 3,
      maximumQuantity: 2,
      jobTitle: 'Administrative Specialist',
      assetType: 'Laptop',
      modelMaximum: 1,
    };

    const result = await reorderResponseObject(data, responseExpectation);
    expect(result).toEqual(expected);
  });

  it('should return null for missing paths', async () => {
    const schemaWithMissingKey = {
      missingField: 'non.existent.path',
    };

    const expected = {
      missingField: undefined,
    };

    const result = await reorderResponseObject(data, schemaWithMissingKey);
    expect(result).toEqual(expected);
  });

  it('should return empty object if schema is empty', async () => {
    const result = await reorderResponseObject(data, {});
    expect(result).toEqual({});
  });
});
