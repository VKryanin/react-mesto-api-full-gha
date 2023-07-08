class EmailIsBusyError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HTTP 409 Conflict';
    this.message = message;
    this.statusCode = 409;
  }
}

module.exports = {
  EmailIsBusyError,
};
