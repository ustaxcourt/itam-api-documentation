export class BadRequest extends Error {
  readonly statusCode = 400;

  constructor(message: string) {
    super(message);
  }
}
