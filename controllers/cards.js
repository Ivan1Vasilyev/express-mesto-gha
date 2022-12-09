const Card = require('../models/cards');
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
    return res.json(cards);
  } catch (e) {
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const createCard = async (req, res) => {
  try {
    const newCard = await Card.create({ owner: req.user.id, ...req.body });
    return res.status(201).json(newCard);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const errors = Object.values(e.errors).map((err) => err.message);
      return res.status(NOT_CORRECT).json({ message: errors.join(', ') });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const deleteCard = async (req, res) => {
  const deletingCard = await Card.findById(req.params.cardId);
  if (req.user.id !== String(deletingCard.owner)) {
    return res.status(401).json({ message: 'Вы не можете удалить чужую карточку' });
  }

  try {
    const response = await Card.findByIdAndRemove(req.params.cardId);
    if (!response) {
      return res
        .status(NOT_EXISTS)
        .json({ message: `${NOT_EXISTS_MESSAGE}: Несуществующий id карточки` });
    }
    return res.json(response);
  } catch (e) {
    if (e.name === 'CastError') {
      return res
        .status(NOT_CORRECT)
        .json({ message: `${NOT_CORRECT_MESSAGE}: Некорректный id карточки` });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const likeCard = async (req, res) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likedCard) {
      return res
        .status(NOT_EXISTS)
        .json({ message: `${NOT_EXISTS_MESSAGE}: Несуществующий id карточки` });
    }
    return res.status(201).json(likedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res
        .status(NOT_CORRECT)
        .json({ message: `${NOT_CORRECT_MESSAGE}: Некорректный id карточки` });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const disLikedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!disLikedCard) {
      return res
        .status(NOT_EXISTS)
        .json({ message: `${NOT_EXISTS_MESSAGE}: Несуществующий id карточки` });
    }
    return res.json(disLikedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return res
        .status(NOT_CORRECT)
        .json({ message: `${NOT_CORRECT_MESSAGE}: Некорректный id карточки` });
    }
    return res.status(DEFAULT_ERROR).json({ message: DEFAULT_ERROR_MESSAGE });
  }
};

module.exports = { deleteCard, getCards, createCard, likeCard, dislikeCard };
