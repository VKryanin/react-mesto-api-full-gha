const Card = require('../models/card');
const {
  STATUS_OK,
  STATUS_CREATED,
} = require('../utils/status');

const { IncorrectRequestError } = require('../utils/errors/IncorrectRequestError');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { DeletionError } = require('../utils/errors/DeletionError');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({});
    res
      .status(STATUS_OK)
      .send(cards);
  } catch (err) {
    next(err);
  }
};

const createCard = async (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  try {
    const card = await Card.create({ name, link, owner });
    res
      .status(STATUS_CREATED)
      .send(card);
  } catch (err) {
    if (err instanceof IncorrectRequestError) {
      next(new IncorrectRequestError('The data is incorrect'));
    } else {
      next(err);
    }
  }
};

const deleteCardById = async (req, res, next) => {
  try {
    const card = await Card
      .findById(req.params.cardId);
    if (!card) {
      throw new NotFoundError('Card is not found');
    } else if (card.owner.toString() === req.user._id) {
      await Card.deleteOne(card);
      res.status(STATUS_OK)
        .send({ data: card });
    } else {
      throw new DeletionError('You do not have sufficient rights');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectRequestError('The data is incorrect'));
    } else {
      next(err);
    }
  }
};

const addCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res
        .status(STATUS_OK)
        .send(card);
    } else {
      throw new NotFoundError('Card is not found');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectRequestError('The data is incorrect'));
    } else {
      next(err);
    }
  }
};

const deleteCardLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    if (card) {
      res
        .status(STATUS_OK)
        .send(card);
    } else {
      throw new NotFoundError('Card is not found');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getCards, createCard, deleteCardById, addCardLike, deleteCardLike,
};
