const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('node:http2').constants;
const bcrypt = require('bcryptjs');
const userModel = require('../models/user');
const { SALT_ROUNDS } = require('../utils/config');
const { generateWebToken } = require('../utils/jwt');
const BadRequestError = require('../exeptions/bad-request-error');
const NotFoundError = require('../exeptions/not-found-error');
const UnauthorizedError = require('../exeptions/unauthorized-error');
const ConflictError = require('../exeptions/conflict-error');

const getUserById = (res, id, next) => userModel
  .findById(id)
  .then((user) => {
    if (!user) {
      return next(new NotFoundError('Пользователь с таким идентификатором не найдена'));
    }
    return res.status(HTTP_STATUS_OK).send(user);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Неверный формат идентификатора пользователя'));
    }
    return next(err);
  });

const readUser = (req, res, next) => {
  const { userId } = req.params;
  return getUserById(res, userId, next);
};

const readCurrentUser = (req, res, next) => getUserById(res, req.user._id, next);

const readAllUsers = (req, res, next) => userModel
  .find({})
  .then((users) => res.status(HTTP_STATUS_OK).send(users))
  .catch(next);

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => userModel
      .create({
        name, about, avatar, email, password: hash,
      }))
    .then((user) => res.status(HTTP_STATUS_CREATED).send({
      email: user.email, name: user.name, about: user.about, avatar: user.avatar,
    }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        return next(new ConflictError('Этот email уже используется'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const updateUserProfile = (req, res, next) => {
  const { name, about } = req.body;

  return userModel
    .findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с таким идентификатором не найдена'));
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return userModel.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return next(new UnauthorizedError('Неправильный email или пароль'));
      }
      return bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          throw err;
        }
        if (!isMatch) {
          return next(new UnauthorizedError('Неправильный email или пароль'));
        }
        return res.status(HTTP_STATUS_OK).send({ jwt: generateWebToken(user._id) });
      });
    })
    .catch(next);
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return userModel
    .findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    )
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с таким идентификатором не найдена'));
      }
      return res.status(HTTP_STATUS_OK).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
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
