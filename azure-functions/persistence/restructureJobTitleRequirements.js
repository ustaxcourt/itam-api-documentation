export function restructureJobTitleRequirements(data) {
  const requirements = {};
  for (const requirement of data) {
    const {
      modelName,
      minimumQuantity,
      maximumQuantity,
      assetType,
      modelMaximum,
      modelMinimum,
    } = requirement;

    if (!requirements[assetType]) {
      requirements[assetType] = {
        minimumQuantity: minimumQuantity || 0,
        maximumQuantity: maximumQuantity,
        models: [],
      };
    }

    requirements[assetType].models.push({
      modelName,
      modelMaximum,
      modelMinimum: modelMinimum || 0,
    });
  }

  return Object.keys(requirements).map(key => ({
    assetType: key,
    ...requirements[key],
  }));
}
