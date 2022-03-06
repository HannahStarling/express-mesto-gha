const cardRouter = require('express').Router();
const {
  getCards,
  deleteCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cardRouter.get('/cards', getCards);
cardRouter.post('/cards', createCard);
cardRouter.delete('/cards/:id', deleteCard);
cardRouter.put('/cards/:id/likes', likeCard);
cardRouter.delete('/cards/:id/likes', dislikeCard);

module.exports = cardRouter;
