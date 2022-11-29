const router = require('express').Router();
const { deleteCard, getCards, createCard, likeCard, dislikeCard } = require('../controllers/cards');

router.get('/', getCards);

router.post('/', createCard);

router.delete('/:cardId', deleteCard);

router.put('/:cardId/likes', likeCard);

router.put('/:cardId/likes', dislikeCard);

module.exports = router;
