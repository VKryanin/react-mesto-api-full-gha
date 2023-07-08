class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HTTP 401 Unauthorized';
    this.message = message;
    this.statusCode = 401;
  }
}

module.exports = {
  UnauthorizedError,
};
