const express = require('express');
const { celebrate, Joi } = require('celebrate');
const urlCheking = require('../utils/regular');
const auth = require('../midlwares/auth');
const { createUser, login } = require('../controllers/users');
const { NotFoundError } = require('../utils/errors/NotFoundError');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

module.exports = (app) => {
  const router = express.Router();

  router.use('/users', auth, userRoutes);
  router.use('/cards', auth, cardRoutes);

  router.get('/crash-test', () => {
    setTimeout(() => {
      throw new Error('Сервер сейчас упадёт');
    }, 0);
  });

  router.post('/signin', celebrate({
    body: Joi.object().keys({
      email: Joi.string().min(7).required().email(),
      password: Joi.string().required(),
    }),
  }), login);

  router.post('/signup', celebrate({
    body: Joi.object().keys({
      email: Joi.string().min(7).required().email(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(3).max(30),
      avatar: Joi.string().pattern(urlCheking),
    }),
  }), createUser);

  router.use('*', auth, (req, res, next) => {
    next(new NotFoundError('Error 404. Page not found'));
  });

  app.use(router);
};
