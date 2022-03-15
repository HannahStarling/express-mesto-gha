const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { errorHandler } = require('./middlewars/errorHandler');
const { validateUser } = require('./validation/validation');
const { auth } = require('./middlewars/auth');

const { PORT = 3000 } = process.env;

const app = express();
app.use(cookieParser());
app.use(errors());
app.use(express.json()); /* bodyParser in framework */

app.post('/signin', validateUser, login);
app.post('/signup', validateUser, createUser);
app.use(auth);
app.use(userRouter);
app.use(cardRouter);
app.use(errorHandler);

const start = async () => {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

start();
