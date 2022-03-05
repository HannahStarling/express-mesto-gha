const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .populate('card')
    .then((cards) => res.send({ data: cards }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;

  Card.create({ name, link, owner })
    .then((card) => {
      res.send({ name: card.name, link: card.link, owner: card.owner });
    })
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )

    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((likes) => res.send({ data: likes }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err.message}` });
    });
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
