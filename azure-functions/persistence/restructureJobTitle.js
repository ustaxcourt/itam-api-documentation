export async function restructureJobTitles(data) {
  const result = {
    JobTitle: '', // Will hold the job title
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
    if (!result.JobTitle) {
      result.JobTitle = jobTitle;
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
        Items: [],
      };
      result.requiredItems.push(assetObj);
    }

    // Add item to Items array
    assetObj.Items.push({ itemName, itemMaximum: modelMaximum });
  });

  return result;
}
