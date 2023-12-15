const router = require('express').Router();
const {
  deleteCard, readAllCards, createCard, likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { valiateCreateCard } = require('../middlewares/validateRequest');

router.get('/', readAllCards);
router.post('/', valiateCreateCard, createCard);
router.delete('/:cardId', deleteCard);
router.put('/:cardId/likes', likeCard);
router.delete('/:cardId/likes', dislikeCard);

module.exports = router;
