const router = require('express').Router();
const { getUser, getUsers, upDateUserData, upDateUserAvatar } = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', getUser);

router.patch('/me', upDateUserData);

router.patch('/me/avatar', upDateUserAvatar);

module.exports = router;
