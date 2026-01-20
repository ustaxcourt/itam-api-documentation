export function restructureDataverseChoiceResponse(data) {
  const optionSet = {};
  for (const OptionSetItem of data) {
    const { Value, Label } = OptionSetItem;

    if (!optionSet[Label.LocalizedLabels[0].Label]) {
      optionSet[Label.LocalizedLabels[0].Label] = Value;
    }
  }

  return optionSet;
}
