const User = require('../models/users');
const {
  DEFAULT_ERROR,
  NOT_CORRECT,
  NOT_EXISTS,
  DEFAULT_ERROR_MESSAGE,
  NOT_CORRECT_MESSAGE,
  NOT_EXISTS_MESSAGE,
} = require('../utils/constants');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(NOT_EXISTS).json({ message: `${NOT_EXISTS_MESSAGE}: Пользователь не найден.` });
    }

    return res.status(200).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(NOT_CORRECT).json({ message: `${NOT_CORRECT_MESSAGE}: Некорректный id.` });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
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
    const userId = req.user._id;
    const { name, about } = req.body;
    await User.updateOne({ _id: userId }, { name, about }, { runValidators: true });
    const updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return res.status(NOT_EXISTS).json({ message: `${NOT_EXISTS_MESSAGE}: Пользователь не найден.` });
    }
    return res.status(200).json(updatedUser);
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
    const userId = req.user._id;
    const { avatar } = req.body;
    await User.updateOne({ _id: userId }, { avatar }, { runValidators: true });
    const updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return res.status(NOT_EXISTS).json({ message: `${NOT_EXISTS_MESSAGE}: Пользователь не найден.` });
    }
    return res.status(200).json(updatedUser);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return res.status(NOT_CORRECT).json({ message: errors.join(', ') });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports = {
  getUser, getUsers, createUser, upDateUserData, upDateUserAvatar,
};
