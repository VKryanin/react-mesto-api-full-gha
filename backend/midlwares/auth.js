const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../utils/errors/UnauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new UnauthorizedError('You should be authenticated'));
  }
  let payload;
  try {
    payload = jwt.verify(token, process.env['JWT_SECRET']);
  } catch (err) {
    return next(new UnauthorizedError('You should be authenticated'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
