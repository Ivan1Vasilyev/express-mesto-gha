const Card = require('../models/cards');
const User = require('../models/users');
const {
  DEFAULT_ERROR,
  NOT_CORRECT,
  NOT_EXISTS,
  DEFAULT_ERROR_MESSAGE,
  NOT_CORRECT_MESSAGE,
  NOT_EXISTS_MESSAGE,
} = require('../utils/constants');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    return res.status(200).json(cards);
  } catch (e) {
    res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const createCard = async (req, res) => {
  try {
    const cardsOwner = await User.findById(req.user._id);
    const newCard = await Card.create({ owner: cardsOwner, ...req.body });
    return res.status(201).json(newCard);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return res.status(NOT_CORRECT).json({ message: errors.join(', ') });
    } else {
      res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
    }
  }
};

const deleteCard = async (req, res) => {
  try {
    const response = await Card.findByIdAndRemove(req.params.cardId);
    console.log(response);
    if (!response) {
      return res.status(NOT_EXISTS).json({ message: `${NOT_EXISTS_MESSAGE}: Несуществующий id карточки` });
    }
    const newCardCollection = await Card.find({});
    return res.status(200).json(newCardCollection);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(NOT_CORRECT).json({ message: `${NOT_CORRECT_MESSAGE}: Некорректный id карточки` });
    } else {
      res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
    }
  }
};

const likeCard = async (req, res) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $addToSet: { likes: req.user._id },
      },
      { new: true }
    );
    if (!likedCard) {
      return res.status(NOT_EXISTS).json({ message: `${NOT_EXISTS_MESSAGE}: Несуществующий id карточки` });
    }
    return res.status(201).json(likedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(NOT_CORRECT).json({ message: `${NOT_CORRECT_MESSAGE}: Некорректный id карточки` });
    } else {
      res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
    }
  }
};

const dislikeCard = async (req, res) => {
  try {
    const disLikedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      {
        $pull: { likes: req.user._id },
      },
      { new: true }
    );
    if (!disLikedCard) {
      return res.status(NOT_EXISTS).json({ message: `${NOT_EXISTS_MESSAGE}: Несуществующий id карточки` });
    }
    return res.status(200).json(disLikedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res.status(NOT_CORRECT).json({ message: `${NOT_CORRECT_MESSAGE}: Некорректный id карточки` });
    } else {
      res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
    }
  }
};

module.exports = { deleteCard, getCards, createCard, likeCard, dislikeCard };
