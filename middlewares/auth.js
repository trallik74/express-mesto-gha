const { HTTP_STATUS_UNAUTHORIZED } = require('node:http2').constants;
const { verifyWebToken } = require('../utils/jwt');

const exeptionHandler = (res) => res
  .status(HTTP_STATUS_UNAUTHORIZED)
  .send({ message: 'Необходима авторизация' });

const auth = async (req, res, next) => {
  /* const token = req.cookies.jwt; */
  const token = req.headers.authorization;
  let payload;
  if (!token) {
    return exeptionHandler(res);
  }

  if (token.startsWith('Bearer ')) {
    token.replace('Bearer ', '');
  }

  try {
    payload = await verifyWebToken(token);

    if (!payload) {
      return exeptionHandler(res);
    }

    req.user = payload;
    return next();
  } catch (err) {
    console.log(err);
    return exeptionHandler(res);
  }
};

module.exports = auth;
