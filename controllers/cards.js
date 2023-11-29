const {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
} = require('node:http2').constants;
const cardModel = require('../models/card');

const deleteCard = (req, res) => {
  const { cardId } = req.params;
  return cardModel
    .findByIdAndDelete(cardId)
    .then((card) => {
      if (!card) {
        return res
          .status(HTTP_STATUS_NOT_FOUND)
          .send({ message: 'Карточка с таким идентификатором не найдена' });
      }
      return res.status(HTTP_STATUS_OK).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: 'Неверный идентификатор карточки' });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера: ${err.message}` });
    });
};

const readAllCards = (req, res) => cardModel
  .find({})
  .populate(['owner', 'likes'])
  .then((card) => res.status(HTTP_STATUS_OK).send(card))
  .catch((err) => res
    .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
    .send({ message: `Ошибка сервера: ${err.message}` }));

const createCard = (req, res) => {
  const { name, link } = req.body;
  return cardModel
    .create({ name, link, owner: req.user._id })
    .then((card) => res.status(HTTP_STATUS_CREATED).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res
          .status(HTTP_STATUS_BAD_REQUEST)
          .send({ message: `Ошибка валидации: ${err.message}` });
      }
      return res
        .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
        .send({ message: `Ошибка сервера: ${err.message}` });
    });
};

const likeCard = (req, res) => cardModel
  .findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      return res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка с таким идентификатором не найдена' });
    }
    return res.status(HTTP_STATUS_OK).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный идентификатор карточки' });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера: ${err.message}` });
  });

const dislikeCard = (req, res) => cardModel
  .findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
  .populate(['owner', 'likes'])
  .then((card) => {
    if (!card) {
      return res
        .status(HTTP_STATUS_NOT_FOUND)
        .send({ message: 'Карточка с таким идентификатором не найдена' });
    }
    return res.status(HTTP_STATUS_OK).send(card);
  })
  .catch((err) => {
    if (err.name === 'CastError') {
      return res
        .status(HTTP_STATUS_BAD_REQUEST)
        .send({ message: 'Неверный идентификатор карточки' });
    }
    return res
      .status(HTTP_STATUS_INTERNAL_SERVER_ERROR)
      .send({ message: `Ошибка сервера: ${err.message}` });
  });

module.exports = {
  deleteCard,
  readAllCards,
  createCard,
  likeCard,
  dislikeCard,
};
