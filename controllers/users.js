const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .orFail(() => {
      res.status(ERR_NOT_FOUND).send({
        message: 'Запрашиваемый пользователь не найден (некорректный id)',
      });
    })
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERR_BAD_REQUEST).send({
          message: 'Пользователь с указанным id не существует.',
        });
      }
      if (err.message === 'NotFound') {
        return res.status(ERR_NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден (некорректный id)',
        });
      }
      return res
        .status(ERR_DEFAULT)
        .send({ message: 'Что-то пошло не так...' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      });
    })
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
        return res.status(ERR_BAD_REQUEST).send({
          message:
            'Введены некорректные данные, невозможно создать пользователя, проверьте имя, описание и аватар на валидность.',
        });
      }
      return res
        .status(ERR_DEFAULT)
        .send({ message: 'Что-то пошло не так...' });
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
      throw new Error('NotFound');
    })
    .then((user) => {
      res.status(200).send({ name: user.name, about: user.about });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({
          message:
            'Введены некорректные данные, невозможно обновить данные пользователя, проверьте корректность указанных имени и описания.',
        });
      }
      if (err.message === 'NotFound') {
        return res.status(ERR_NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден (некорректный id)',
        });
      }
      return res
        .status(ERR_DEFAULT)
        .send({ message: 'Что-то пошло не так...' });
    });
};

const updateUserAvatar = (req, res) => {
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
      throw new Error('NotFound');
    })
    .then((user) => res.status(200).send({ avatar: user.avatar }))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({
          message:
            'Введены некорректные данные, невозможно обновить аватар, проверьте корректность указанной ссылки.',
        });
      }
      if (err.message === 'NotFound') {
        return res.status(ERR_NOT_FOUND).send({
          message: 'Запрашиваемый пользователь не найден (некорректный id)',
        });
      }
      return res
        .status(ERR_DEFAULT)
        .send({ message: 'Что-то пошло не так...' });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', {
        expiresIn: '7d',
      });
      res.cookie('jwt', token, {
        maxAge: '7d',
        httpOnly: true,
        sameSite: true,
      });
    })
    .catch(() => {
      res.status(401).send({ message: 'Необходимо авторизироваться' });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
  login,
};
