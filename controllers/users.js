const User = require('../models/user');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .orFail(() => {
      res.status(ERR_NOT_FOUND).send({
        message: 'Не найдено ни одного пользователя',
      });
    })
    .then((users) => res.status(200).send(users))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    })
    .catch(next);
};

const getUser = (req, res, next) => {
  User.findById(req.params.id)
    .orFail(() => {
      res.status(ERR_NOT_FOUND).send({
        message: 'Запрашиваемый пользователь не найден (некорректный id)',
      });
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    })
    .catch(next);
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => {
      res.status(200).send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      res.status(ERR_NOT_FOUND).send({
        message:
          'Не удалось обновить информацию, проверьте корректность вводимых данных',
      });
    })
    .then((user) => {
      res.status(200).send({ name: user.name, about: user.about });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }

      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

const updateUserAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail(() => {
      res.status(ERR_NOT_FOUND).send({
        message:
          'Не удалось обновить аватар, проверьте корректность вводимых данных',
      });
    })
    .then((user) => res.status(200).send({ avatar: user.avatar }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }

      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
};
