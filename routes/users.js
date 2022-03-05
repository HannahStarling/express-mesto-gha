const userRouter = require('express').Router();
const { getUsers, getUser, createUser } = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:userId', getUser);
userRouter.post('/users', createUser);

module.exports = userRouter;

/* {
  "name": "Hermione Granger",
  "about": "Muggle-born witch ",
  "avatar": "https://static.wikia.nocookie.net/harrypotter/images/4/40/Harry-potter1-sorting1.jpg/revision/latest/scale-to-width-down/250?cb=20150718235057"
} */
