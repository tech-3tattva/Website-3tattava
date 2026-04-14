function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || "Internal Server Error",
  };
  if (err.code) payload.code = err.code;

  res.status(statusCode).json(payload);
}

class ApiError extends Error {
  constructor(statusCode, message, code) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

module.exports = { errorHandler, ApiError };

