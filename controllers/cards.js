const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
} = require('node:http2').constants;
const BadRequestError = require('../exeptions/bad-request-error');
const NotFoundError = require('../exeptions/not-found-error');
const ForbiddenError = require('../exeptions/forbidden-error');
const cardModel = require('../models/card');

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return cardModel
    .findById(cardId)
    .then((card) => {
      if (!card) {
        return next(new NotFoundError('Карточка с таким идентификатором не найдена'));
      }
      if (String(card.owner) !== req.user._id) {
        return next(new ForbiddenError('Вы не владелец карточки'));
      }
      return cardModel.findByIdAndDelete(cardId).then(() => res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Неверный формат идентификатора карточки'));
      }
      return next(err);
    });
};

const readAllCards = (req, res, next) => cardModel
  .find({})
  .populate(['owner', 'likes'])
  .then((card) => res.status(HTTP_STATUS_OK).send(card))
  .catch(next);

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  return cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(err.message));
      }
      return next(err);
    });
};

const likeCard = (req, res, next) => cardModel
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка с таким идентификатором не найдена'));
    }
    return res.status(HTTP_STATUS_OK).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Неверный формат идентификатора карточки'));
    }
    return next(err);
  });

const dislikeCard = (req, res, next) => cardModel
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      return next(new NotFoundError('Карточка с таким идентификатором не найдена'));
    }
    return res.status(HTTP_STATUS_OK).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return next(new BadRequestError('Неверный формат идентификатора карточки'));
    }
    return next(err);
  });

module.exports = {
  deleteCard,
  readAllCards,
  createCard,
  likeCard,
  dislikeCard,
};
