const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUserById,
  updateAvatar,
  updateProfile,
  getInfo,
} = require('../controllers/users');
const urlCheking = require('../utils/regular');

router.get('/', getUsers);

router.get('/me', getInfo);

router.get('/:id', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(3).max(30),
  }),
}), updateProfile);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlCheking),
  }),
}), updateAvatar);

module.exports = router;
