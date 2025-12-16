import { restructureJobTitles } from './restructureJobTitle.js'; // Update with actual file name

describe('restructureJobTitles', () => {
  it('should group items by jobTitle and assetType correctly', async () => {
    const input = [
      {
        jobTitle: 'Administrative Specialist',
        assetType: 'Desk Clamp Power Strip',
        minimumQuantity: 1,
        maximumQuantity: 1,
        itemName: 'CM568',
        modelMaximum: 1,
      },
      {
        jobTitle: 'Administrative Specialist',
        assetType: 'Laptop',
        minimumQuantity: 3,
        maximumQuantity: 2,
        itemName: '727pm',
        modelMaximum: 1,
      },
      {
        jobTitle: 'Administrative Specialist',
        assetType: 'Laptop',
        minimumQuantity: 3,
        maximumQuantity: 2,
        itemName: '22U Open Framer Server Rack',
        modelMaximum: 1,
      },
    ];

    const expected = {
      'Administrative Specialist': {
        requiredItems: [
          {
            assetType: 'Desk Clamp Power Strip',
            minimumQuantity: 1,
            maximumQuantity: 1,
            Items: [{ itemName: 'CM568', itemMaximum: 1 }],
          },
          {
            assetType: 'Laptop',
            minimumQuantity: 3,
            maximumQuantity: 2,
            Items: [
              { itemName: '727pm', itemMaximum: 1 },
              { itemName: '22U Open Framer Server Rack', itemMaximum: 1 },
            ],
          },
        ],
      },
    };

    const result = await restructureJobTitles(input);
    expect(result).toEqual(expected);
  });

  it('should return an empty object for empty input', async () => {
    const result = await restructureJobTitles([]);
    expect(result).toEqual({});
  });
});
