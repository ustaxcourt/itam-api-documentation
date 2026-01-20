import { restructureDataverseChoiceResponse } from './restructureDataverseChoiceResponse.js';

describe('restructureDataverseChoiceResponse', () => {
  it('should return a one level dictionary of options and thier values', async () => {
    const data = [
      {
        Value: 0,
        Color: null,
        IsManaged: false,
        ExternalValue: '',
        ParentValues: [],
        Tag: null,
        IsHidden: false,
        MetadataId: null,
        HasChanged: null,
        Label: {
          LocalizedLabels: [
            {
              Label: 'Excellent',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: 'da16cc54-76cf-4341-bf04-d4aad0804e24',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: 'Excellent',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: 'da16cc54-76cf-4341-bf04-d4aad0804e24',
            HasChanged: null,
          },
        },
        Description: {
          LocalizedLabels: [
            {
              Label: '',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: 'e29bd25e-8f19-47fb-bea6-3a58c1b81b56',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: '',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: 'e29bd25e-8f19-47fb-bea6-3a58c1b81b56',
            HasChanged: null,
          },
        },
      },
      {
        Value: 1,
        Color: null,
        IsManaged: false,
        ExternalValue: '',
        ParentValues: [],
        Tag: null,
        IsHidden: false,
        MetadataId: null,
        HasChanged: null,
        Label: {
          LocalizedLabels: [
            {
              Label: 'Good',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: '6182ba31-123a-40a2-8951-5146524deb78',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: 'Good',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: '6182ba31-123a-40a2-8951-5146524deb78',
            HasChanged: null,
          },
        },
        Description: {
          LocalizedLabels: [
            {
              Label: '',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: '152bc13a-4fed-4bc2-b3fe-07eed29d8ba2',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: '',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: '152bc13a-4fed-4bc2-b3fe-07eed29d8ba2',
            HasChanged: null,
          },
        },
      },
      {
        Value: 2,
        Color: null,
        IsManaged: false,
        ExternalValue: '',
        ParentValues: [],
        Tag: null,
        IsHidden: false,
        MetadataId: null,
        HasChanged: null,
        Label: {
          LocalizedLabels: [
            {
              Label: 'Poor',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: '28d4d344-4298-4235-944b-9eeb5aff091e',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: 'Poor',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: '28d4d344-4298-4235-944b-9eeb5aff091e',
            HasChanged: null,
          },
        },
        Description: {
          LocalizedLabels: [
            {
              Label: '',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: '70c5f939-3a1a-4a2c-a5d7-49c40f6ee46d',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: '',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: '70c5f939-3a1a-4a2c-a5d7-49c40f6ee46d',
            HasChanged: null,
          },
        },
      },
      {
        Value: 3,
        Color: null,
        IsManaged: false,
        ExternalValue: '',
        ParentValues: [],
        Tag: null,
        IsHidden: false,
        MetadataId: null,
        HasChanged: null,
        Label: {
          LocalizedLabels: [
            {
              Label: 'Garbage',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: '4dc86081-1c7b-42e5-aa36-059f1634ad1e',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: 'Garbage',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: '4dc86081-1c7b-42e5-aa36-059f1634ad1e',
            HasChanged: null,
          },
        },
        Description: {
          LocalizedLabels: [
            {
              Label: '',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: 'aaab2388-d231-43b8-96af-2016921edd1a',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: '',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: 'aaab2388-d231-43b8-96af-2016921edd1a',
            HasChanged: null,
          },
        },
      },
      {
        Value: 4,
        Color: null,
        IsManaged: false,
        ExternalValue: '',
        ParentValues: [],
        Tag: null,
        IsHidden: false,
        MetadataId: null,
        HasChanged: null,
        Label: {
          LocalizedLabels: [
            {
              Label: 'Damaged',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: '86e2c2f5-4112-4f73-9ef7-e432721f46ce',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: 'Damaged',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: '86e2c2f5-4112-4f73-9ef7-e432721f46ce',
            HasChanged: null,
          },
        },
        Description: {
          LocalizedLabels: [
            {
              Label: '',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: '3b37da27-bc54-455e-a2b4-9d3443edc8d2',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: '',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: '3b37da27-bc54-455e-a2b4-9d3443edc8d2',
            HasChanged: null,
          },
        },
      },
      {
        Value: 5,
        Color: null,
        IsManaged: false,
        ExternalValue: '',
        ParentValues: [],
        Tag: null,
        IsHidden: false,
        MetadataId: null,
        HasChanged: null,
        Label: {
          LocalizedLabels: [
            {
              Label: 'New',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: 'f30cc978-4fc1-4c4a-acf3-8f0c9af3f7b2',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: 'New',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: 'f30cc978-4fc1-4c4a-acf3-8f0c9af3f7b2',
            HasChanged: null,
          },
        },
        Description: {
          LocalizedLabels: [
            {
              Label: '',
              LanguageCode: 1033,
              IsManaged: false,
              MetadataId: 'f18b9976-a2ce-432d-8cf6-9862cd94c936',
              HasChanged: null,
            },
          ],
          UserLocalizedLabel: {
            Label: '',
            LanguageCode: 1033,
            IsManaged: false,
            MetadataId: 'f18b9976-a2ce-432d-8cf6-9862cd94c936',
            HasChanged: null,
          },
        },
      },
    ];

    const result = restructureDataverseChoiceResponse(data);

    expect(Object.keys(result).length).toBe(6);
    expect(result).toHaveProperty('New');
    expect(result).toHaveProperty('Damaged');
    expect(result).toHaveProperty('Garbage');
    expect(result).toHaveProperty('Poor');
    expect(result).toHaveProperty('Excellent');
  });
});
