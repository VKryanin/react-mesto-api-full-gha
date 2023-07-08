const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');
const mongoose = require('mongoose');
const { ValidationError } = mongoose.Error;
const {
  STATUS_OK,
  STATUS_CREATED,
} = require('../utils/status');

const { IncorrectRequestError } = require('../utils/errors/IncorrectRequestError');
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { EmailIsBusyError } = require('../utils/errors/EmailIsBusyError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('User with this ID was not found.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then(() => res.status(201).send({
      name, about, avatar, email,
    }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectRequestError(err.message));
      } else if (err.code === 11000) {
        next(new EmailIsBusyError('User with this email already exists'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => next(err));
};

const getInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('User with this ID was not found.'))
    .then((userData) => res.send({ data: userData }))
    .catch((err) => next(err));
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFound('User with this ID was not found.'))
    .then((updateProfile) => res.send({ data: updateProfile }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;

  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFound('Incorrected user ID'))
    .then((newAvatar) => res.send({ data: newAvatar }))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectRequestError(err.message));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateAvatar,
  updateProfile,
  login,
  getInfo,
};
