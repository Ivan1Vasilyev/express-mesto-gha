const router = require('express').Router();
const {
  getUser,
  getUsers,
  upDateUserData,
  upDateUserAvatar,
  getUserData,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/me', getUserData);

router.get('/:userId', getUser);

router.patch('/me', upDateUserData);

router.patch('/me/avatar', upDateUserAvatar);

module.exports = router;
