const { HTTP_STATUS_UNAUTHORIZED } = require('node:http2').constants;
const { verifyWebToken } = require('../utils/jwt');

const authExeptionHandler = (res) => res
  .status(HTTP_STATUS_UNAUTHORIZED)
  .send({ message: 'Необходима авторизация' });

const auth = async (req, res, next) => {
  /* const token = req.cookies.jwt; */
  let token = req.headers.authorization;
  let payload;
  if (!token) {
    return authExeptionHandler(res);
  }

  if (token.startsWith('Bearer ')) {
    token = token.replace('Bearer ', '');
  }

  try {
    payload = await verifyWebToken(token);

    if (!payload) {
      return authExeptionHandler(res);
    }

    req.user = payload;
    return next();
  } catch (err) {
    console.log(err);
    return authExeptionHandler(res);
  }
};

module.exports = auth;
