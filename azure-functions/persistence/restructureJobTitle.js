export async function restructureJobTitles(data) {
  const result = {};

  data.forEach(item => {
    const { JobTitle, AssetType, minimumquanitity, MaximumQuantity, ItemName } =
      item;

    // Ensure JobTitle exists
    if (!result[JobTitle]) {
      result[JobTitle] = { 'Required Items': [] };
    }

    // Check if AssetType already exists in the Required Items array
    let assetObj = result[JobTitle]['Required Items'].find(
      obj => obj.AssetType === AssetType,
    );

    if (!assetObj) {
      assetObj = {
        AssetType: AssetType,
        minimumquanitity: minimumquanitity,
        MaximumQuantity: MaximumQuantity,
        Items: [],
      };
      result[JobTitle]['Required Items'].push(assetObj);
    }

    // Add ItemName to Items array
    assetObj.Items.push(ItemName);
  });

  return result;
}
