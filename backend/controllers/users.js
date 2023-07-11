const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/user');

const { ValidationError } = mongoose.Error;
const { security } = require('../utils/config');

const { IncorrectRequestError } = require('../utils/errors/IncorrectRequestError');
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
      const token = jwt.sign({ _id: user._id }, security, { expiresIn: '7d' });
      res.send({ token });
    })
    .catch((err) => {
      next(err);
    });
};

const getInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new NotFoundError('User with this ID was not found.'))
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      next(err);
    });
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .orFail(new NotFoundError('User with this ID was not found.'))
    .then((updatedProfile) => {
      res.send({ data: updatedProfile });
    })
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new IncorrectRequestError(err.message));
      } else {
        next(err);
      }
    });
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .orFail(new NotFoundError('Incorrected user ID'))
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
