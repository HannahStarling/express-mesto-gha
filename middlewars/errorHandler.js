const { ApiError } = require('../errors/ApiError');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message });
  }
  return res.status(500).json({ message: `На сервере произошла ошибка` });
};

module.exports = { errorHandler };
