const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');
const { security } = require('../utils/config');

const TokenWrong = (res, req, next) => {
  next(new UnauthorizedError('Incorrected token.'));
};

function auth(req, res, next) {
  const { authorization } = req.headers;
  let payload;
  if (!authorization || !authorization.startsWith('Bearer ')) return TokenWrong(res, req, next);
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token.trim()) return TokenWrong(res, req, next);
    payload = jwt.verify(token, security);
  } catch (err) {
    return TokenWrong(res, req, next);
  }

  req.user = payload;
  return next();
}

module.exports = auth;
