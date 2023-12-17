const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const generateWebToken = (_id) => jwt.sign({ _id }, JWT_SECRET, { expiresIn: '7d' });
const verifyWebToken = (token) => jwt.verify(
  token,
  JWT_SECRET,
  (err, decoded) => ({ _id: decoded._id }),
);

module.exports = {
  generateWebToken,
  verifyWebToken,
};
