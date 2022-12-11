/* eslint-disable consistent-return */
const Card = require('../models/cards');
const { NOT_CORRECT_MESSAGE, NOT_EXISTS_MESSAGE } = require('../utils/constants');
const NotFoundError = require('../errors/not-found');
const NotValidError = require('../errors/not-valid');
const NotAcceptedError = require('../errors/not-accepted');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    return res.json(cards);
  } catch (e) {
    next(e);
  }
};

const createCard = async (req, res, next) => {
  try {
    const newCard = await Card.create({ owner: req.user._id, ...req.body });
    return res.status(201).json(newCard);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const messages = Object.values(e.errors)
        .map((err) => err.message)
        .join(', ');
      const err = new NotValidError(messages);
      next(err);
    }
    next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const deletingCard = await Card.findById(req.params.cardId);
    if (!deletingCard) {
      throw new NotFoundError(`${NOT_EXISTS_MESSAGE}: Несуществующий id карточки`);
    }

    if (req.user._id !== String(deletingCard.owner)) {
      throw new NotAcceptedError('Вы не можете удалить чужую карточку');
    }

    const response = await Card.findByIdAndRemove(req.params.cardId);

    return res.json(response);
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new NotValidError(`${NOT_CORRECT_MESSAGE}: Некорректный id карточки`);
      next(err);
    }
    next(e);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (!likedCard) {
      throw new NotFoundError(`${NOT_EXISTS_MESSAGE}: Несуществующий id карточки`);
    }
    return res.status(201).json(likedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new NotValidError(`${NOT_CORRECT_MESSAGE}: Некорректный id карточки`);
      next(err);
    }
    next(e);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const disLikedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (!disLikedCard) {
      throw new NotFoundError(`${NOT_EXISTS_MESSAGE}: Несуществующий id карточки`);
    }
    return res.json(disLikedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      const err = new NotValidError(`${NOT_CORRECT_MESSAGE}: Некорректный id карточки`);
      next(err);
    }
    next(e);
  }
};

module.exports = { deleteCard, getCards, createCard, likeCard, dislikeCard };
