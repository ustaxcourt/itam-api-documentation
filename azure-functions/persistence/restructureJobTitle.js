export async function restructureJobTitle(data) {
  const result = {
    jobTitle: '', // Will hold the job title
    requiredItems: [], // Will hold the asset list
  };

  data.forEach(item => {
    const {
      jobTitle,
      assetType,
      minimumQuantity,
      maximumQuantity,
      itemName,
      modelMaximum,
    } = item;

    // Set JobTitle once
    if (!result.jobTitle) {
      result.jobTitle = jobTitle;
    }

    // Check if AssetType already exists
    let assetObj = result.requiredItems.find(
      obj => obj.assetType === assetType,
    );

    if (!assetObj) {
      assetObj = {
        assetType,
        minimumQuantity,
        maximumQuantity,
        items: [],
      };
      result.requiredItems.push(assetObj);
    }

    // Add item to Items array
    assetObj.items.push({ itemName, itemMaximum: modelMaximum });
  });

  return result;
}
