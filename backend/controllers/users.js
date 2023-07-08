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

const getUsers = async (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch((err) => next(err));
};

const getUserById = async (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(new NotFoundError('User with this ID was not found.'))
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

const createUser = async (req, res, next) => {
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

const getInfo = async (req, res, next) => {
  try {
    const user = await User
      .findById(req.user._id);
    if (user) {
      res
        .status(STATUS_OK)
        .send({ data: user });
    } else {
      throw new NotFoundError('User is not found');
    }
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    if (user) {
      res
        .status(STATUS_OK)
        .send(user);
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (err) {
    if (err instanceof IncorrectRequestError) {
      next(new IncorrectRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
};

const updateAvatar = async (req, res, next) => {
  const { avatar } = req.body;
  try {
    const user = await User
      .findByIdAndUpdate(
        req.user._id,
        { avatar },
        { new: true, runValidators: true },
      );
    if (user) {
      res
        .status(STATUS_OK)
        .send(user);
    } else {
      throw new NotFoundError('User not found');
    }
  } catch (err) {
    if (err instanceof IncorrectRequestError) {
      next(new IncorrectRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
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
