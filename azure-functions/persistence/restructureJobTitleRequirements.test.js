import { restructureJobTitleRequirements } from './restructureJobTitleRequirements.js';

describe('restructureJobTitleRequirements', () => {
  it('should group models by assetType', async () => {
    const data = [
      {
        assetType: 'Laptop',
        minimumQuantity: 1,
        maximumQuantity: 2,
        modelName: 'Dell XPS',
        modelMaximum: 1,
        modelMinimum: 0,
      },
      {
        assetType: 'Laptop',
        minimumQuantity: 1,
        maximumQuantity: 2,
        modelName: 'MacBook Pro',
        modelMaximum: 1,
        modelMinimum: 0,
      },
      {
        assetType: 'Phone',
        minimumQuantity: 1,
        maximumQuantity: 1,
        modelName: 'iPhone 7',
        modelMaximum: 1,
        modelMinimum: 1,
      },
    ];

    const result = restructureJobTitleRequirements(data);

    expect(result).toHaveLength(2);

    const laptopGroup = result.find(item => item.assetType === 'Laptop');

    expect(laptopGroup.models).toHaveLength(2);
    expect(laptopGroup.models).toEqual(
      expect.arrayContaining([
        { modelName: 'Dell XPS', modelMaximum: 1, modelMinimum: 0 },
        { modelName: 'MacBook Pro', modelMaximum: 1, modelMinimum: 0 },
      ]),
    );

    const phoneGroup = result.find(item => item.assetType === 'Phone');
    expect(phoneGroup.models).toEqual([
      { modelName: 'iPhone 7', modelMaximum: 1, modelMinimum: 1 },
    ]);
  });

  it('should handle empty data array', async () => {
    const result = restructureJobTitleRequirements([]);
    expect(result).toHaveLength(0);
  });
});
