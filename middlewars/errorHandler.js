const { ApiError } = require('../errors/ApiError');

const handleNotFound = (req, res, next) => next(ApiError.notFound('Маршрут не найден'));

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: `На сервере произошла ошибка ${err}` });
};

module.exports = { errorHandler, handleNotFound };
