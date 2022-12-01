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

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const newUser = await User.create({ name, about, avatar });
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

module.exports = {
  getUser,
  getUsers,
  createUser,
  upDateUserData,
  upDateUserAvatar,
};
