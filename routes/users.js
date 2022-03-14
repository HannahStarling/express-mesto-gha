const userRouter = require('express').Router();
const {
  getUsers,
  getUser,
  updateUser,
  updateUserAvatar,
  getCurrentUser,
} = require('../controllers/users');
const {
  validateUserInfo,
  validateUserAvatar,
  validateDataBaseId,
} = require('../validation/validation');

userRouter.get('/users', getUsers);
userRouter.get('/users/:id', validateDataBaseId, getUser);
userRouter.get('/users/me', getCurrentUser);
userRouter.patch('/users/me', validateUserInfo, updateUser);
userRouter.patch('/users/me/avatar', validateUserAvatar, updateUserAvatar);

module.exports = userRouter;
