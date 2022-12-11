const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { deleteCard, getCards, createCard, likeCard, dislikeCard } = require('../controllers/cards');
const { joiNameOrAbout, joiUrl, joiId } = require('../utils/joi-validators');

router.get('/', getCards);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: joiNameOrAbout(true),
      link: joiUrl(),
    }),
  }),
  createCard,
);

router.delete('/:cardId', celebrate(joiId('cardId')), deleteCard);

router.put(
  '/:cardId/likes',
  celebrate({ params: Joi.object().keys({ cardId: joiId() }) }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({ params: Joi.object().keys({ cardId: Joi.string().alphanum().length(24) }) }),
  dislikeCard,
);

module.exports = router;
