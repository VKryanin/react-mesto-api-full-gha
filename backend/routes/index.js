const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const urlCheking = require('../utils/regular');
const auth = require('../midlwares/auth');
const { createUser, login } = require('../controllers/users');
const { NotFoundError } = require('../utils/errors/NotFoundError');

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(3).max(30),
    avatar: Joi.string().pattern(urlCheking),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res, next) => {
  next(new NotFoundError('Error 404. Page not found'));
});

module.exports = router;
