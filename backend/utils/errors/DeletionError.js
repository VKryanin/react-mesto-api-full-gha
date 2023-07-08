class DeletionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HTTP 403 Forbidden';
    this.message = message;
    this.statusCode = 403;
  }
}

module.exports = {
  DeletionError,
};
