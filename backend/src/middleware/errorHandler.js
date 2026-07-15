const { ZodError } = require("zod");

function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars

  // Validation failures → clean 400 with a single readable message
  // (instead of a 500 with a stringified ZodError blob).
  if (err instanceof ZodError) {
    const first = err.issues && err.issues[0];
    const field = first && first.path && first.path.length ? `${first.path.join(".")}: ` : "";
    return res.status(400).json({
      message: `${field}${(first && first.message) || "Invalid input"}`,
      code: "validation_error",
    });
  }

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

