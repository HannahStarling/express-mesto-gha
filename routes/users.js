const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', getUser);
userRouter.get('/users/me', getCurrentUser);
userRouter.patch('/users/me', updateUser);
userRouter.patch('/users/me/avatar', updateUserAvatar);

module.exports = userRouter;
