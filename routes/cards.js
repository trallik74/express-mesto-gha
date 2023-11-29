const router = require('express').Router();
const {
  deleteCard, readAllCards, createCard, likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', readAllCards);
router.post('/', createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
