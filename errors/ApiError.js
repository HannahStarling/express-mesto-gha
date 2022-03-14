class ApiError extends Error {
  constructor(status, message) {
    super();
    this.status = status;
    this.message = message;
  }

  static badRequest(message) {
    return new ApiError(400, message);
  }

  static unauthorized() {
    return new ApiError(401, 'Необходима авторизация');
  }

  static forbidden() {
    return new ApiError(403, 'Недостаточно прав!');
  }

  static notFound(message) {
    return new ApiError(404, message);
  }

  static conflict(message) {
    return new ApiError(409, message);
  }

  static iternal() {
    return new ApiError(500, 'Что-то пошло не так...');
  }
}

module.exports = { ApiError };
