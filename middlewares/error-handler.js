const { HTTP_STATUS_INTERNAL_SERVER_ERROR } = require('node:http2').constants;

const errorHandler = (err, req, res, next) => {
  if (err.statusCode) {
    return res.status(err.statusCode).send({ message: err.message });
  }

  console.log(err);
  return res
    .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: 'Ошибка сервера' }) && next();
};

module.exports = errorHandler;
