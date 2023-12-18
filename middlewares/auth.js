const { verifyWebToken } = require('../utils/jwt');
const UnauthorizedError = require('../exeptions/unauthorized-error');

const auth = async (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  if (token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '');
  }

  try {
    const payload = verifyWebToken(token);
    req.user = { _id: payload._id };
  } catch (err) {
    console.log(err);
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  return next();
};

module.exports = auth;
