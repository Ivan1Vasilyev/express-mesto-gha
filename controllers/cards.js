const Card = require('../models/cards');
const User = require('../models/users');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req, res) => {
  try {
    const cardsOwner = await User.findById(req.user._id);
    const newCard = await Card.create({ owner: cardsOwner, ...req.body });
    return res.status(201).json(newCard);
  } catch (e) {
    console.error(e);
    const errors = Object.values(e.errors).map((err) => err.message);
    return res.status(400).json({ message: errors.join(', ') });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;
    await Card.deleteOne({ _id: cardId });
    const newCardCollection = await Card.find({});
    return res.status(200).json(newCardCollection);
  } catch (e) {
    return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const likeCard = async (req, res) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    if (!likedCard) {
      return res.status(404).json({ message: 'Карточка не найдена.' });
    }
    return res.status(201).json(likedCard);
  } catch (e) {
    return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const disLikedCard = await Card.findByIdAndUpdate(
      req.params,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    if (!disLikedCard) {
      return res.status(404).json({ message: 'Карточка не найдена.' });
    }
    return res.status(201).json(disLikedCard);
  } catch (e) {
    return res.status(500).json({ message: 'На сервере произошла ошибка' });
  }
};

module.exports = { deleteCard, getCards, createCard, likeCard, dislikeCard };
