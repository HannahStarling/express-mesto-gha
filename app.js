const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
// const { auth } = require('./middlewars/auth');

const { PORT = 3000 } = process.env;

const app = express();

app.use(express.json()); /* bodyParser in framework */

app.post('/signin', login);
app.post('/signup', createUser);
// app.use(auth);
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
