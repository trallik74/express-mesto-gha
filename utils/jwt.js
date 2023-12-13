const jwt = require('jsonwebtoken');
const userModel = require('../models/user');
const { JWT_ACCESS_SECRET } = require('./config');

const generateWebToken = (_id) => jwt.sign({ _id }, JWT_ACCESS_SECRET, { expiresIn: '7d' });

const verifyWebToken = (token) => jwt.verify(token, JWT_ACCESS_SECRET, (err, decoded) => {
  if (err) {
    console.log(err);
    return null;
  }
  return userModel
    .findById(decoded._id)
    .then((user) => {
      if (!user) return null;
      return { _id: decoded._id };
    })
    .catch((error) => {
      console.log(error);
      return null;
    });
});

module.exports = {
  generateWebToken,
  verifyWebToken,
};
