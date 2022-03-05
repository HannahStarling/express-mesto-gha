const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');

const { PORT = 3000 } = process.env;
const app = express();

// mongoose.connect('mongodb://localhost:27017/mestodbnew', {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
//   useUnifiedTopology: true,
// });
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', userRouter);
app.use((req, res, next) => {
  req.user = {
    _id: '622359413c7d30d00f071c74', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.listen(PORT);
