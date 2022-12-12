const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  getUsers,
  upDateUserData,
  upDateUserAvatar,
  getUserData,
} = require('../controllers/users');
const { joiNameOrAbout, joiUrl, joiId } = require('../utils/joi-validators');

router.get('/', getUsers);

router.get('/me', getUserData);

router.get('/:userId', celebrate({ params: Joi.object().keys({ userId: joiId() }) }), getUser);

router.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      name: joiNameOrAbout(true),
      about: joiNameOrAbout(true),
    }),
  }),
  upDateUserData,
);

router.patch(
  '/me/avatar',
  celebrate({ body: Joi.object().keys({ avatar: joiUrl(true) }) }),
  upDateUserAvatar,
);

module.exports = router;
