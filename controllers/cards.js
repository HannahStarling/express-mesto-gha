const Card = require('../models/card');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .orFail(new Error('Не найдено ни одной карточки'))
    .populate('user')
    .then((cards) => res.send(cards))
    .catch((err) => {
      res.status(ERR_DEFAULT).send({ message: err.message });
      res.status(ERR_BAD_REQUEST).send({ message: err.message });
      res.status(ERR_NOT_FOUND).send({ message: err.message });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(new Error('Карточка с указанным id не существует'))
    .then((card) => res.send(card))
    .catch((err) => {
      res.status(ERR_DEFAULT).send({ message: err.message });
      res.status(ERR_BAD_REQUEST).send({ message: err.message });
      res.status(ERR_NOT_FOUND).send({ message: err.message });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .orFail(
      new Error(
        'Не удалось создать карточку, проверьте корректность вводимых данных'
      )
    )
    .then((card) => {
      res.send({ name: card.name, link: card.link, owner: card.owner });
    })
    .catch((err) => {
      res.status(ERR_DEFAULT).send({ message: err.message });
      res.status(ERR_BAD_REQUEST).send({ message: err.message });
      res.status(ERR_NOT_FOUND).send({ message: err.message });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error('Не удалось поставить лайк, ошибка программы'))
    .then((likes) => res.send(likes))
    .catch((err) => {
      res.status(ERR_DEFAULT).send({ message: err.message });
      res.status(ERR_BAD_REQUEST).send({ message: err.message });
      res.status(ERR_NOT_FOUND).send({ message: err.message });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(new Error('Не удалось поставить дизлайк, ошибка программы'))
    .then((likes) => res.send(likes))
    .catch((err) => {
      res.status(ERR_DEFAULT).send({ message: err.message });
      res.status(ERR_BAD_REQUEST).send({ message: err.message });
      res.status(ERR_NOT_FOUND).send({ message: err.message });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
