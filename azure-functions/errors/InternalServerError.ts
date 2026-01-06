export class InternalServerError extends Error {
  readonly statusCode = 500;

  constructor(message: string) {
    super(message);
  }
}
