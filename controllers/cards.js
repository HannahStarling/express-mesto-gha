const Card = require('../models/card');
const {
  ERR_BAD_REQUEST,
  ERR_DEFAULT,
  ERR_NOT_FOUND,
} = require('../errors/errors');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      res.status(ERR_DEFAULT).send({ message: 'Что-то пошло не так...' });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(ERR_BAD_REQUEST).send({
          message: 'Введены некорректные данные, невозможно удалить карточку.',
        });
      }
      if (err.message === 'NotFound') {
        return res.status(ERR_NOT_FOUND).send({
          message: 'Карточка с указанным id не существует',
        });
      }
      return res
        .status(ERR_DEFAULT)
        .send({ message: 'Что-то пошло не так...' });
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
        return res.status(ERR_BAD_REQUEST).send({
          message:
            'Введены некорректные данные, невозможно создать карточку, проверьте название и ссылку.',
        });
      }
      return res
        .status(ERR_DEFAULT)
        .send({ message: 'Что-то пошло не так...' });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((likes) => res.status(200).send(likes))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({
          message:
            'Введены некорректные данные, невозможно поставить лайк до устранения ошибки.',
        });
      }
      if (err.message === 'NotFound') {
        return res.status(ERR_NOT_FOUND).send({
          message: 'Карточка с указанным id не существует',
        });
      }
      return res
        .status(ERR_DEFAULT)
        .send({ message: 'Что-то пошло не так...' });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(ERR_BAD_REQUEST).send({
          message:
            'Введены некорректные данные, невозможно убрать лайк до устранения ошибки.',
        });
      }
      if (err.message === 'NotFound') {
        return res.status(ERR_NOT_FOUND).send({
          message: 'Карточка с указанным id не существует',
        });
      }
      return res
        .status(ERR_DEFAULT)
        .send({ message: 'Что-то пошло не так...' });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
