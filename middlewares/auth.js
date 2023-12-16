const { verifyWebToken } = require('../utils/jwt');
const UnauthorizedError = require('../exeptions/unauthorized-error');

const auth = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  if (token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '');
  }

  const payload = verifyWebToken(token, next);

  if (!payload) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  req.user = payload;
  return next();
};

module.exports = auth;
