const jwt = require('jsonwebtoken');
const { JWT_ACCESS_SECRET } = require('./config');
const UnauthorizedError = require('../exeptions/unauthorized-error');

const generateWebToken = (_id) => jwt.sign({ _id }, JWT_ACCESS_SECRET, { expiresIn: '7d' });

const verifyWebToken = (token, next) => jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
  if (err) {
    console.log(err);
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  return { _id: decoded._id };
});

module.exports = {
  generateWebToken,
  verifyWebToken,
};
