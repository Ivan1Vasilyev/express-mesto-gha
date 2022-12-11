const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUsers,
  upDateUserData,
  upDateUserAvatar,
  getUserData,
} = require('../controllers/users');
const { REGEXP_URL } = require('../utils/constants');

router.get('/', getUsers);

router.get('/me', getUserData);

router.get(
  '/:userId',
  celebrate({
    params: Joi.object().keys({
      userId: Joi
        .string()
        .required()
        .alphanum()
        .length(24),
    }),
  }),
  getUser,
);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  upDateUserData,
);

router.patch(
  '/me/avatar',
  celebrate({ body: Joi.object().keys({ avatar: Joi.string().required().pattern(REGEXP_URL) }) }),
  upDateUserAvatar,
);

module.exports = router;
