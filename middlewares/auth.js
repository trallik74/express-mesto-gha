const { HTTP_STATUS_FORBIDDEN } = require('node:http2').constants;
const { verifyWebToken } = require('../utils/jwt');

const auth = async (req, res, next) => {
  const token = req.cookies.jwt;
  const payload = await verifyWebToken(token);

  if (!token || !payload) {
    return res
      .status(HTTP_STATUS_FORBIDDEN)
      .send({ message: 'Необходима авторизация' });
  }
  req.user = payload;
  return next();
};

module.exports = auth;
