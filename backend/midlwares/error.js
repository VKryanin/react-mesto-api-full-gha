const errorListener = (err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Internal Server Error 12'
      : message,
  });
  next();
};

module.exports = errorListener;
