export async function restructureJobTitles(data) {
  const result = {};

  data.forEach(item => {
    const {
      jobTitle,
      assetType,
      minimumQuantity,
      maximumQuantity,
      itemName,
      modelMaximum,
    } = item;

    // Ensure JobTitle exists
    if (!result[jobTitle]) {
      result[jobTitle] = { requiredItems: [] };
    }

    // Check if AssetType already exists in the Required Items array
    let assetObj = result[jobTitle]['requiredItems'].find(
      obj => obj.assetType === assetType,
    );

    if (!assetObj) {
      assetObj = {
        assetType: assetType,
        minimumQuantity: minimumQuantity,
        maximumQuantity: maximumQuantity,
        Items: [],
      };
      result[jobTitle]['requiredItems'].push(assetObj);
    }

    // Add ItemName to Items array
    assetObj.Items.push({ itemName: itemName, itemMaximum: modelMaximum });
  });

  return result;
}
