class IncorrectRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HTTP 400 Bad Request';
    this.message = message;
    this.statusCode = 400;
  }
}

module.exports = {
  IncorrectRequestError,
};
