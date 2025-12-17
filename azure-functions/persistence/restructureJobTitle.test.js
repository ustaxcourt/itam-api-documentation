import { restructureJobTitles } from './restructureJobTitle.js';

describe('restructureJobTitles', () => {
  test('should group items by assetType under one job title', async () => {
    const data = [
      {
        jobTitle: 'Engineer',
        assetType: 'Laptop',
        minimumQuantity: 1,
        maximumQuantity: 2,
        itemName: 'Dell XPS',
        modelMaximum: 1,
      },
      {
        jobTitle: 'Engineer',
        assetType: 'Laptop',
        minimumQuantity: 1,
        maximumQuantity: 2,
        itemName: 'MacBook Pro',
        modelMaximum: 1,
      },
      {
        jobTitle: 'Engineer',
        assetType: 'Phone',
        minimumQuantity: 1,
        maximumQuantity: 1,
        itemName: 'iPhone',
        modelMaximum: 1,
      },
    ];

    const result = await restructureJobTitles(data);

    expect(result.JobTitle).toBe('Engineer');
    expect(result.requiredItems).toHaveLength(2);

    const laptopGroup = result.requiredItems.find(
      item => item.assetType === 'Laptop',
    );
    expect(laptopGroup.Items).toHaveLength(2);
    expect(laptopGroup.Items).toEqual(
      expect.arrayContaining([
        { itemName: 'Dell XPS', itemMaximum: 1 },
        { itemName: 'MacBook Pro', itemMaximum: 1 },
      ]),
    );

    const phoneGroup = result.requiredItems.find(
      item => item.assetType === 'Phone',
    );
    expect(phoneGroup.Items).toEqual([{ itemName: 'iPhone', itemMaximum: 1 }]);
  });

  test('should handle empty data array', async () => {
    const result = await restructureJobTitles([]);
    expect(result.JobTitle).toBe('');
    expect(result.requiredItems).toHaveLength(0);
  });
});
