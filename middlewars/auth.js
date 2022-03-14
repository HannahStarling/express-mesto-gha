const jwt = require('jsonwebtoken');
const { ApiError } = require('../errors/ApiError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw ApiError.unauthorized();
  }

  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    throw ApiError.unauthorized();
  }
  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
