//Can be string,string because we're mapping a dot-path name to a dataverse column logical name
type SchemaMap = Record<string, string>;

//TOutput requires the extension to be indexable allowing key assignment
//TInput is object extension to allow valid access to nested properties
export function parseDataverseResponse<
  TOutput extends Record<string, unknown>,
  TInput extends Record<string, unknown>,
>({ data, schema }: { data: TInput; schema: SchemaMap }): TOutput {
  const result = {} as TOutput;

  //Split the function over several lines for readability
  for (const [key, path] of Object.entries(schema)) {
    result[key as keyof TOutput] = path
      .split('.')
      .reduce<unknown>(
        (acc, part) =>
          acc && typeof acc === 'object'
            ? (acc as Record<string, unknown>)[part]
            : undefined,
        data,
      ) as TOutput[keyof TOutput];
  }

  return result;
}
