const User = require('../models/user');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getUsers = (req, res) => {
  User.find({})
    .orFail(new Error('Не найдено ни одного пользователя'))
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.status === ERR_BAD_REQUEST) {
        res.status(ERR_BAD_REQUEST).send({ message: err.message });
      }
      if (err.status === ERR_NOT_FOUND) {
        res.status(ERR_NOT_FOUND).send({ message: err.message });
      }
      res.status(ERR_DEFAULT).send({ message: err.message });
    });
};

const getUser = (req, res) => {
  User.findById(req.params.id)
    .orFail(new Error('Запрашиваемый пользователь не найден (некорректный id)'))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.status === ERR_BAD_REQUEST) {
        res.status(ERR_BAD_REQUEST).send({ message: err.message });
      }
      if (err.status === ERR_NOT_FOUND) {
        res.status(ERR_NOT_FOUND).send({ message: err.message });
      }
      res.status(ERR_DEFAULT).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .orFail(
      new Error(
        'Не удалось создать пользователя, проверьте корректность вводимых данных'
      )
    )
    .then((user) => {
      res.send({ name: user.name, about: user.about, avatar: user.avatar });
    })
    .catch((err) => {
      if (err.status === ERR_BAD_REQUEST) {
        res.status(ERR_BAD_REQUEST).send({ message: err.message });
      }
      if (err.status === ERR_NOT_FOUND) {
        res.status(ERR_NOT_FOUND).send({ message: err.message });
      }
      res.status(ERR_DEFAULT).send({ message: err.message });
    });
};

const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.params.id, { name, about })
    .orFail(
      new Error(
        'Не удалось обновить информацию пользователя, проверьте корректность вводимых данных'
      )
    )
    .then((user) => res.send({ name: user.name, about: user.about }))
    .catch((err) => {
      if (err.status === ERR_BAD_REQUEST) {
        res.status(ERR_BAD_REQUEST).send({ message: err.message });
      }
      if (err.status === ERR_NOT_FOUND) {
        res.status(ERR_NOT_FOUND).send({ message: err.message });
      }
      res.status(ERR_DEFAULT).send({ message: err.message });
    });
};

const updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.params.id, { avatar })
    .orFail(
      new Error(
        'Не удалось обновить аватар, проверьте корректность вводимых данных'
      )
    )
    .then((user) => res.send({ avatar: user.avatar }))
    .catch((err) => {
      if (err.status === ERR_BAD_REQUEST) {
        res.status(ERR_BAD_REQUEST).send({ message: err.message });
      }
      if (err.status === ERR_NOT_FOUND) {
        res.status(ERR_NOT_FOUND).send({ message: err.message });
      }
      res.status(ERR_DEFAULT).send({ message: err.message });
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateUserAvatar,
};
