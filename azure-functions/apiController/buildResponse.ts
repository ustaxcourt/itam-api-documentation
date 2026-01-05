//If more calls use this ApiResponse piece, we can make a centralized types file
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
