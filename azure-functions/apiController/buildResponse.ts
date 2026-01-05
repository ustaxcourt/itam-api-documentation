//Right now we're just exporting directly from this file but we can centralize
// data: null is for COMMAND calls where we're not expecting back data to use
export type ApiResponse<TData = unknown> = {
  status: number;
  jsonBody: {
    message: string;
    data: TData | null;
  };
};

//TData can be anything that we're inputting, Object or Object[], without losing data shape as unknown
//TData is still defaulted to a null if nothing is provided
export function buildResponse<TData = unknown>(
  status: number,
  message: string,
  data: TData | null = null,
): ApiResponse<TData> {
  return {
    status,
    jsonBody: { message, data },
  };
}
