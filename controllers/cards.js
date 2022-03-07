const Card = require('../models/card');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }

      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      res.status(ERR_NOT_FOUND).send({
        message: 'Карточка с указанным id не существует',
      });
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }

      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({
        name: card.name,
        link: card.link,
        owner: card.owner,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }

      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      res.status(ERR_NOT_FOUND).send({
        message: 'Карточка с указанным id не существует',
      });
    })
    .then((likes) => res.status(200).send(likes))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }

      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      res.status(ERR_NOT_FOUND).send({
        message: 'Карточка с указанным id не существует',
      });
    })
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(ERR_BAD_REQUEST).send({ message: 'Что-то пошло не так...' });
      }

      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
