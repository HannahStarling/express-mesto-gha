const { ApiError } = require('../errors/ApiError');
const Card = require('../models/card');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.status(200).send(cards))
    .catch(() => {
      throw ApiError.iternal();
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.id)
    .orFail(() => {
      throw ApiError.notFound('Карточка с указанным id не существует');
    })
    .then(({ owner }) => {
      if (owner.toString() === req.user._id) {
        Card.findByIdAndRemove(req.params.id).then((card) => {
          res.status(200).send(card);
        });
      } else {
        throw ApiError.forbidden();
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw ApiError.badRequest(
          'Введены некорректные данные, невозможно удалить карточку.',
        );
      }
      throw ApiError.iternal();
    })
    .catch(next);
};

const createCard = (req, res, next) => {
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
        throw ApiError.badRequest(
          'Введены некорректные данные, невозможно создать карточку, проверьте название и ссылку.',
        );
      }
      throw ApiError.iternal();
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw ApiError.notFound('Карточка с указанным id не существует');
    })
    .then((likes) => res.status(200).send(likes))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw ApiError.badRequest(
          'Введены некорректные данные, невозможно поставить лайк до устранения ошибки.',
        );
      }
      throw ApiError.iternal();
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      throw ApiError.notFound('Карточка с указанным id не существует');
    })
    .then((likes) => res.send(likes))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        throw ApiError.badRequest(
          'Введены некорректные данные, невозможно убрать лайк до устранения ошибки.',
        );
      }
      throw ApiError.iternal();
    })
    .catch(next);
};

module.exports = {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
};
