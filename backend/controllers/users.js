const bcrypt = require('bcryptjs');
const jsonWebToken = require('jsonwebtoken');
const User = require('../models/user');

const {
  STATUS_OK,
  STATUS_CREATED,
} = require('../utils/status');

const { IncorrectRequestError } = require('../utils/errors/IncorrectRequestError');
const { UnauthorizedError } = require('../utils/errors/UnauthorizedError');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const { EmailIsBusyError } = require('../utils/errors/EmailIsBusyError');

const getUsers = async (req, res, next) => {
  try {
    const users = await User
      .find({});
    res.status(STATUS_OK)
      .send({ data: users });
  } catch (err) {
    next(err);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User
      .findById(req.params.userId);
    if (user) {
      res.status(STATUS_OK)
        .send({ data: user });
    } else {
      throw new NotFoundError('User is not found');
    }
  } catch (err) {
    if (err.name === 'CastError') {
      next(new IncorrectRequestError('The data is incorrect'));
    } else {
      next(err);
    }
  }
};

const createUser = async (req, res, next) => {
  const {
    name, email, password, about, avatar,
  } = req.body;
  try {
    const hashPassword = await bcrypt.hash(String(password), 10);
    const user = await User
      .create({
        name, about, avatar, email, password: hashPassword,
      });
    res
      .status(STATUS_CREATED)
      .send({ data: user });
  } catch (err) {
    if (err instanceof IncorrectRequestError) {
      next(new IncorrectRequestError('Data is incorrect'));
    } else if (err.code === 11000) {
      next(new EmailIsBusyError('User with this email already exists'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email })
      .select('+password');
    if (user) {
      const isValidUser = await bcrypt.compare(String(password), user.password);
      if (isValidUser) {
        const jwt = jsonWebToken.sign({
          _id: user._id,
        }, process.env['JWT_SECRET']);
        res.cookie('jwt', jwt, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
          sameSite: true,
          secure: true,
        });
        res
          .status(STATUS_OK)
          .send({ data: user.toJSON() });
      } else {
        console.log(res.status);
        throw new UnauthorizedError('Incorrect password or email');
      }
    } else { throw new UnauthorizedError('Incorrect password or email'); }
  } catch (err) {
    if (err instanceof IncorrectRequestError) {
      next(new IncorrectRequestError('Data is incorrect'));
    } else {
      next(err);
    }
  }
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
