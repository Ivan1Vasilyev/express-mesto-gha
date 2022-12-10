/* eslint-disable consistent-return */
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const { NOT_CORRECT_MESSAGE, NOT_EXISTS_MESSAGE } = require('../utils/constants');
const NotFoundError = require('../errors/not-found');
const NotValidError = require('../errors/not-valid');
const NotAuthorizedError = require('../errors/not-authorized');
const SameEmailError = require('../errors/same-email');

const { JWT_SECRET } = process.env;

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (e) {
    next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      throw new NotFoundError(`${NOT_EXISTS_MESSAGE}: Пользователь не найден.`);
    }

    return res.json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new NotValidError(`${NOT_CORRECT_MESSAGE}: Некорректный id`);
      next(err);
    }
    next(e);
  }
};

const getUserData = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw new NotFoundError(`${NOT_EXISTS_MESSAGE}: Пользователь не найден.`);
    }
    return res.status(201).json(user);
  } catch (e) {
    next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const hash = await bcryptjs.hash(req.body.password, 10);
    const { name, about, avatar, email } = req.body;
    const newUser = await User.create({ name, about, avatar, email, password: hash });
    return res.status(201).json({ _id: newUser._id, email });
  } catch (e) {
    if (e.name === 'ValidationError') {
      const messages = Object.values(e.errors)
        .map((err) => err.message)
        .join(', ');
      const err = new NotValidError(messages);
      next(err);
    } else if (e.code === 11000) {
      const err = new SameEmailError('Пользователь с таким email уже зарегистрирован');
      next(err);
    }
    next(e);
  }
};

const upDateUserData = async (req, res, next) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { runValidators: true, new: true },
    );

    if (!updatedUser) {
      throw new NotFoundError(`${NOT_EXISTS_MESSAGE}: Пользователь не найден.`);
    }

    return res.json(updatedUser);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const messages = Object.values(e.errors)
        .map((err) => err.message)
        .join(', ');
      next(new NotValidError(messages));
    }
    next(e);
  }
};

const upDateUserAvatar = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { avatar: req.body.avatar },
      {
        runValidators: true,
        new: true,
      },
    );

    if (!updatedUser) {
      throw new NotFoundError(`${NOT_EXISTS_MESSAGE}: Пользователь не найден.`);
    }

    return res.json(updatedUser);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const messages = Object.values(e.errors)
        .map((err) => err.message)
        .join(', ');
      next(new NotValidError(messages));
    }
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new NotAuthorizedError('Неправильные почта или пароль');
    }
    const isLogged = await bcryptjs.compare(password, user.password);
    if (!isLogged) {
      throw new NotAuthorizedError('Неправильные почта или пароль');
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res
      .status(201)
      .cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .json({ message: 'Токен jwt передан в cookie' });
  } catch (e) {
    next(e);
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
