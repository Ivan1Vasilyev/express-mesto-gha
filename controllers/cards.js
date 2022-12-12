const escape = require('escape-html');
const Card = require('../models/cards');
const { NOT_CORRECT_MESSAGE, NOT_EXISTS_MESSAGE, CREATED_CODE } = require('../utils/constants');
const NotFoundError = require('../errors/not-found');
const NotValidError = require('../errors/not-valid');
const NotAcceptedError = require('../errors/not-accepted');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.json(cards);
  } catch (e) {
    return next(e);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({
      owner: req.user._id,
      name: name ? escape(name) : name,
      link,
    });
    return res.status(CREATED_CODE).json(newCard);
  } catch (e) {
    if (e.name === 'ValidationError') {
      const messages = Object.values(e.errors)
        .map((err) => err.message)
        .join(', ');
      return next(new NotValidError(messages));
    }
    return next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const deletingCard = await Card.findById(req.params.cardId).populate(['owner', 'likes']);
    if (!deletingCard) {
      return next(new NotFoundError(`${NOT_EXISTS_MESSAGE}: Несуществующий id карточки`));
    }

    if (req.user._id !== String(deletingCard.owner._id)) {
      return next(new NotAcceptedError('Вы не можете удалить чужую карточку'));
    }

    deletingCard.remove();

    return res.json(deletingCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new NotValidError(`${NOT_CORRECT_MESSAGE}: Некорректный id карточки`));
    }
    return next(e);
  }
};

const likeCard = async (req, res, next) => {
  try {
    const likedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!likedCard) {
      return next(new NotFoundError(`${NOT_EXISTS_MESSAGE}: Несуществующий id карточки`));
    }
    return res.status(CREATED_CODE).json(likedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new NotValidError(`${NOT_CORRECT_MESSAGE}: Некорректный id карточки`));
    }
    return next(e);
  }
};

const dislikeCard = async (req, res, next) => {
  try {
    const disLikedCard = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (!disLikedCard) {
      return next(new NotFoundError(`${NOT_EXISTS_MESSAGE}: Несуществующий id карточки`));
    }
    return res.json(disLikedCard);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new NotValidError(`${NOT_CORRECT_MESSAGE}: Некорректный id карточки`));
    }
    return next(e);
  }
};

module.exports = {
  deleteCard,
  getCards,
  createCard,
  likeCard,
  dislikeCard,
};
