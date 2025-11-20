export class AppError extends Error {
  constructor(status = 404, message, passUp = false) {
    super(message);
    this.status = status;
    this.passUp = passUp;
  }
}
