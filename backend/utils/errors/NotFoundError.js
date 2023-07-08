class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'HTTP 404 Page not found';
    this.message = message;
    this.statusCode = 404;
  }
}

module.exports = {
  NotFoundError,
};
