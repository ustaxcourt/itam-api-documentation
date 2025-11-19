export function buildResponse(status, message, data = null) {
  let response = {
    status: status,
    jsonBody: {
      message: message,
      data: data,
    },
  };
  return response;
}
