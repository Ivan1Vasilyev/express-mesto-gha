const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const escape = require('escape-html');
const User = require('../models/users');
const { NOT_CORRECT_MESSAGE, NOT_EXISTS_MESSAGE, CREATED_CODE } = require('../utils/constants');
const NotFoundError = require('../errors/not-found');
const NotValidError = require('../errors/not-valid');
const NotAuthorizedError = require('../errors/not-authorized');
const SameEmailError = require('../errors/same-email');
const { getErrorMessages } = require('../utils/handle-errors');

const { JWT_SECRET } = process.env;

const findUser = async (res, next, id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return next(new NotFoundError(`${NOT_EXISTS_MESSAGE}: Пользователь не найден.`));
    }
    return res.json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new NotValidError(`${NOT_CORRECT_MESSAGE}: Некорректный id`));
    }
    return next(e);
  }
};

const updateUser = async (req, res, next, updates) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      return next(new NotFoundError(`${NOT_EXISTS_MESSAGE}: Пользователь не найден.`));
    }

    return res.json(updatedUser);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new NotValidError(getErrorMessages(e)));
    }
    return next(e);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (e) {
    return next(e);
  }
};

const getUser = async (req, res, next) => {
  const { userId } = req.params;
  return findUser(res, next, userId);
};

const getUserData = async (req, res, next) => {
  const { _id } = req.user;
  return findUser(res, next, _id);
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcryptjs.hash(req.body.password, 10);
    const { name, about, avatar, email } = req.body;
    const newUser = await User.create({
      name: name ? escape(name) : name,
      about: about ? escape(about) : about,
      avatar,
      email,
      password: hash,
    });
    return res.status(CREATED_CODE).json({
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
      _id: newUser._id,
    });
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new NotValidError(getErrorMessages(e)));
    }
    if (e.code === 11000) {
      return next(new SameEmailError('Пользователь с таким email уже зарегистрирован'));
    }
    return next(e);
  }
};

const upDateUserData = async (req, res, next) => {
  const { name, about } = req.body;
  return updateUser(req, res, next, { name: escape(name), about: escape(about) });
};

const upDateUserAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  return updateUser(req, res, next, { avatar });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new NotAuthorizedError('Неправильные почта или пароль'));
    }

    const isLogged = await bcryptjs.compare(password, user.password);
    if (!isLogged) {
      return next(new NotAuthorizedError('Неправильные почта или пароль'));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .json({ message: 'Токен jwt передан в cookie' });
  } catch (e) {
    return next(e);
  }
};

module.exports = {
  getUser,
  getUsers,
  createUser,
  upDateUserData,
  upDateUserAvatar,
  login,
  getUserData,
};
