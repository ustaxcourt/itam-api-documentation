//1:1 mapping of the expected input per the loop
type JobRequirementInput = {
  modelName?: string;
  minimumQuantity?: number;
  maximumQuantity?: number;
  assetType: string;
  modelMaximum?: number;
  modelMinimum?: number;
};

//Smallest model of a single model and its requirements
type ModelRequirement = {
  modelName?: string;
  modelMaximum?: number;
  modelMinimum: number; //Required because we have a default value of 0
};

//This comes from the if block
export type AssetRequirement = {
  assetType: string;
  minimumQuantity: number; //Required because we have a default value of 0
  maximumQuantity?: number;
  models: ModelRequirement[];
};

export function restructureJobTitleRequirements(
  data: JobRequirementInput[],
): AssetRequirement[] {
  // The accumulator is indexed by assetType so we don't need to include that value in the object shape
  // assetType is explicitly added during the return at the end
  const requirements: Record<string, Omit<AssetRequirement, 'assetType'>> = {};
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
