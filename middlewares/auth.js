const { verifyWebToken } = require('../utils/jwt');
const UnauthorizedError = require('../exeptions/unauthorized-error');

const auth = async (req, res, next) => {
  /* const token = req.cookies.jwt; */
  let token = req.headers.authorization;
  let payload;
  if (!token) {
    return next(new UnauthorizedError('Необходима авторизация'));
  }

  if (token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '');
  }

  try {
    payload = await verifyWebToken(token);

    if (!payload) {
      return next(new UnauthorizedError('Необходима авторизация'));
    }
  } catch (err) {
    console.log(err);
    return next(new UnauthorizedError('Необходима авторизация'));
  }
  req.user = payload;
  return next();
};

module.exports = auth;
