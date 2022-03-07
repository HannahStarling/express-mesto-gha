const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { logger } = require('./middlewars/logger');
// const errorHandler = require('./middlewars/errorHandler');

const { PORT = 3000 } = process.env;

const app = express();

app.use(logger);
app.use(express.json()); /* bodyParser in framework */

app.use((req, res, next) => {
  req.user = {
    _id: '622359413c7d30d00f071c74',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use((req, res) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

const start = async () => {
  await mongoose.connect('mongodb://localhost:27017/mestodb');
  // eslint-disable-next-line no-console
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

start();
