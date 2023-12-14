const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_FORBIDDEN,
} = require('node:http2').constants;
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { SALT_ROUNDS } = require('../utils/config');
const { generateWebToken } = require('../utils/jwt');

/* const WEEK_IN_MS = 604800000; */

const checkEmailAndPasswordFill = (email, password, res) => {
  if (!email || !password) {
    return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Поля "email" и "password" должно быть заполнено' });
    /* next(); */
  }
  return null;
};

const getUserById = (res, id) => userModel
  .findById(id)
  .then((user) => {
    if (!user) {
      return res.status(HTTP_STATUS_NOT_FOUND).send({ message: 'Пользователь с таким идентификатором не найдена' });
    }
    return res.status(HTTP_STATUS_OK).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: 'Неверный формат идентификатора пользователя' });
    }
    return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
  });

const readUser = (req, res) => {
  const { userId } = req.params;
  getUserById(res, userId);
};

const readCurrentUser = (req, res) => {
  getUserById(res, req.user._id);
};

const readAllUsers = (req, res) => userModel
  .find({})
  .then((users) => res.status(HTTP_STATUS_OK).send(users))
  .catch((err) => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` }));

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  checkEmailAndPasswordFill(email, password, res, next);
  /* Здесь могла быть ваша валидация пароля */

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => userModel
      .create({
        name, about, avatar, email, password: hash,
      }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send(user))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return res.status(HTTP_STATUS_CONFLICT).send({ message: 'Этот email уже используется' });
      }
      if (err.name === 'ValidationError') {
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
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
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
      }
      return res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` });
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  checkEmailAndPasswordFill(email, password, res, next);

  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return res.status(HTTP_STATUS_FORBIDDEN).send({ message: 'Неправильный email или пароль' });
      }
      console.log(password);
      console.log(user);
      return bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          throw err;
        }
        if (!isMatch) {
          return res.status(HTTP_STATUS_FORBIDDEN).send({ message: 'Неправильный email или пароль' });
        }
        /* return res.status(HTTP_STATUS_OK).cookie('jwt', generateWebToken(user._id), {
          maxAge: WEEK_IN_MS,
          httpOnly: true,
          sameSite: true,
        }).end(); */
        return res.status(HTTP_STATUS_OK).send({ jwt: generateWebToken(user._id) });
      });
    })
    .catch((err) => res.status(HTTP_STATUS_INTERNAL_SERVER_ERROR).send({ message: `Ошибка сервера: ${err.message}` }));
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
        return res.status(HTTP_STATUS_BAD_REQUEST).send({ message: err.message });
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
  loginUser,
  readCurrentUser,
};
