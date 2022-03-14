const { celebrate, Joi, CelebrateError } = require('celebrate');
const { isValidObjectId } = require('mongoose');

const avatarLinkValidator =
  // eslint-disable-next-line no-useless-escape
  /https*:\/\/w{0,3}\.*[\w\d\-\-\.\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]{1,}#*/m;

const isValidId = Joi.custom((value) => {
  if (isValidObjectId(value)) return value;
  throw CelebrateError('Неверный id');
});

const validateDataBaseId = celebrate({
  params: Joi.object().keys({
    id: isValidId,
  }),
});

const validateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
});

const validateUserInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(avatarLinkValidator),
  }),
});

const validateCardInfo = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().pattern(avatarLinkValidator).required(),
  }),
});

module.exports = {
  validateCardInfo,
  validateUser,
  validateUserAvatar,
  validateUserInfo,
  validateDataBaseId,
};
