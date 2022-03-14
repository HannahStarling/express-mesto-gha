const cardRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const {
  validateDataBaseId,
  validateCardInfo,
} = require('../validation/validation');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', validateCardInfo, createCard);
cardRouter.delete('/cards/:id', validateDataBaseId, deleteCard);
cardRouter.put('/cards/:id/likes', validateDataBaseId, likeCard);
cardRouter.delete('/cards/:id/likes', validateDataBaseId, dislikeCard);

module.exports = cardRouter;
