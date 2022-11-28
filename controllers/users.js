const User = require('../models/users');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'Ошибка' });
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
    console.error(e);
    return res.status(500).json({ message: 'Ошибка' });
  }
};

const createUser = async (req, res) => {
  try {
    console.log(req.body);
    const newUser = await User.create(req.body);
    return res.status(201).json(newUser);
  } catch (e) {
    console.error(e);
    const errors = Object.values(e.errors).map(err => err.message);
    return res.status(400).json({ message: errors.join(', ') });
  }
};

module.exports = { getUser, getUsers, createUser };
