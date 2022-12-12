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
      link: joiUrl(true),
    }),
  }),
  createCard,
);

router.delete(
  '/:cardId',
  celebrate({ params: Joi.object().keys({ cardId: joiId() }) }),
  deleteCard,
);

router.put(
  '/:cardId/likes',
  celebrate({ params: Joi.object().keys({ cardId: joiId() }) }),
  likeCard,
);

router.delete(
  '/:cardId/likes',
  celebrate({ params: Joi.object().keys({ cardId: joiId() }) }),
  dislikeCard,
);

module.exports = router;
