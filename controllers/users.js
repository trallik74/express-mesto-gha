const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('node:http2').constants;
const userModel = require('../models/user');

const readUser = (req, res) => {
  const { userId } = req.params;
  return userModel
    .findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким идентификатором не найдена' });
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Неверный идентификатор пользователя' });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
    });
};

const readAllUsers = (req, res) => userModel
  .find({})
  .then((users) => res.status(HTTP_STATUS_OK).send(users))
  .catch((err) => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` }));

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  return userModel
    .create({ name, about, avatar })
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
    });
};

const updateUserProfile = (req, res) => {
  const { name, about } = req.body;

  return userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким идентификатором не найдена' });
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;

  return userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким идентификатором не найдена' });
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: `Ошибка валидации: ${err.message}` });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
    });
};

module.exports = {
  readUser,
  readAllUsers,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
