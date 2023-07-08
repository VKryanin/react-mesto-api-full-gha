const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { NODE_ENV, JWT_SECRET } = process.env;

const TokenWrong = (res, req, next) => {
  next(new UnauthorizedError('Incorrected token.'));
};

function auth(req, res, next) {
  const { authorization } = req.headers;
  let payload;
  if (!authorization || !authorization.startsWith('Bearer '))
    return handleError(res, req, next);
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return TokenWrong(res, req, next);
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    return TokenWrong(res, req, next);
  }

  req.user = payload;

  next();
};

module.exports = auth;
