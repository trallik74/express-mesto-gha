const router = require('express').Router();
const {
  deleteCard, readAllCards, createCard, likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { valiateCreateCard, validateCardIdParams } = require('../middlewares/validateRequest');

router.get('/', readAllCards);
router.post('/', valiateCreateCard, createCard);
router.delete('/:cardId', validateCardIdParams, deleteCard);
router.put('/:cardId/likes', validateCardIdParams, likeCard);
router.delete('/:cardId/likes', validateCardIdParams, dislikeCard);

module.exports = router;
