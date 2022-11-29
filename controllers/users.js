const User = require('../models/users');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const getUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }

    return res.status(200).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(400).json({ message: 'Некорректный id.' });
    }
    return res.status(500).json(e);
  }
};

const createUser = async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (e) {
    console.error(e);
    const errors = Object.values(e.errors).map((err) => err.message);
    return res.status(400).json({ message: errors.join(', ') });
  }
};

const upDateUserData = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, about } = req.body;
    await User.updateOne({ _id: userId }, { name: name, about: about }, { runValidators: true });
    const updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    return res.status(200).json(updatedUser);
  } catch (e) {
    console.error(e);
    const errors = Object.values(e.errors).map((err) => err.message);
    return res.status(400).json({ message: errors.join(', ') });
  }
};

const upDateUserAvatar = async (req, res) => {
  try {
    const userId = req.user._id;
    const { avatar } = req.body;
    await User.updateOne({ _id: userId }, { avatar: avatar }, { runValidators: true });
    const updatedUser = await User.findById(userId);
    if (!updatedUser) {
      return res.status(404).json({ message: 'Пользователь не найден.' });
    }
    return res.status(200).json(updatedUser);
  } catch (e) {
    console.error(e);
    const errors = Object.values(e.errors).map((err) => err.message);
    return res.status(400).json({ message: errors.join(', ') });
  }
};

module.exports = { getUser, getUsers, createUser, upDateUserData, upDateUserAvatar };
