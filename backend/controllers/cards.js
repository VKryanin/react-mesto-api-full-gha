const mongoose = require('mongoose');

const { ValidationError } = mongoose.Error;
const Card = require('../models/card');

const { IncorrectRequestError } = require('../utils/errors/IncorrectRequestError');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { DeletionError } = require('../utils/errors/DeletionError');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch((err) => next(err));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.status(201).send({ data: card }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const deleteCardById = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('The data is incorrect'))
    .then((foundCard) => {
      if (!foundCard.owner.equals(req.user._id)) return next(new DeletionError('You do not have sufficient rights'));

      return Card.deleteOne(foundCard)
        .then(() => res.send({ message: foundCard }));
    })
    .catch((err) => next(err));
};

const addCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('The data is incorrect'))
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

const deleteCardLike = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError('The data is incorrect'))
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports = {
  getCards, createCard, deleteCardById, addCardLike, deleteCardLike,
};
