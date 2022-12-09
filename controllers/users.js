const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const {
  DEFAULT_ERROR,
  NOT_CORRECT,
  NOT_EXISTS,
  DEFAULT_ERROR_MESSAGE,
  NOT_CORRECT_MESSAGE,
  NOT_EXISTS_MESSAGE,
} = require('../utils/constants');

const { JWT_SECRET } = process.env;

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.json(users);
  } catch (e) {
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(NOT_EXISTS)
        .json({ message: `${NOT_EXISTS_MESSAGE}: Пользователь не найден.` });
    }

    return res.json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(NOT_CORRECT).json({ message: `${NOT_CORRECT_MESSAGE}: Некорректный id.` });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const getUserData = async (req, res) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }

  const token = authorization.replace(/^Bearer\s/, '');

  try {
    const userId = jwt.verify(token, JWT_SECRET).id;

    if (!userId) return res.status(401).json({ message: 'Авторизуйтесь' });

    const { _id, name, about, email, avatar } = await User.findById(userId);
    return res.status(201).json({ _id, name, about, email, avatar });
  } catch (err) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }
};

const createUser = async (req, res) => {
  try {
    const hash = await bcryptjs.hash(req.body.password, 10);
    const { name, about, avatar, email } = req.body;
    const newUser = await User.create({ name, about, avatar, email, password: hash });
    return res.status(201).json({ _id: newUser._id, email });
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return res.status(NOT_CORRECT).json({ message: errors.join(', ') });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const upDateUserData = async (req, res) => {
  try {
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { runValidators: true, new: true },
    );

    if (!updatedUser) {
      return res
        .status(NOT_EXISTS)
        .json({ message: `${NOT_EXISTS_MESSAGE}: Пользователь не найден.` });
    }

    return res.json(updatedUser);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return res.status(NOT_CORRECT).json({ message: errors.join(', ') });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const upDateUserAvatar = async (req, res) => {
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
      return res
        .status(NOT_EXISTS)
        .json({ message: `${NOT_EXISTS_MESSAGE}: Пользователь не найден.` });
    }

    return res.json(updatedUser);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return res.status(NOT_CORRECT).json({ message: errors.join(', ') });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Неправильные почта или пароль' });
    }
    const isLogged = await bcryptjs.compare(password, user.password);
    if (!isLogged) {
      return res.status(401).json({ message: 'Неправильные почта или пароль' });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });
    return res
      .status(201)
      .cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
      .json({ message: 'Токен передан в cookie' });
  } catch (e) {
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
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
