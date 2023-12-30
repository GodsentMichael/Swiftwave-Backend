const unAuthorized = (res) => {
  res.status(403).json({
    errors: [{ error: "You are not authorized to perform this operation" }],
  });
};

const unAuthenticated = (res) => {
  res.status(401).json({
    errors: [{ error: "You need to login first" }],
  });
};

const badRequest = (res, message) => {
  res.status(400).json({
    errors: [{ error: message }],
  });
};

const notFound = (res, resource) => {
  res.status(404).json({ errors: [{ error: `${resource} not found!` }] });
};

const formatServerError = (res, message, error) => {
  console.log(message, error);
  res.status(500).json({ errors: [{ error: "Server Error" }] });
};

const AppError = (
  statusCode,
  message,
  cause,
  errorCode,
  isOperational = true
) => {
  const error = new Error(message);

  error.statusCode = statusCode;
  error.cause = cause instanceof Error ? cause : undefined;
  error.errorCode = errorCode;
  error.isOperational = isOperational;

  Error.captureStackTrace(error, createAppError);

  return error;
};

module.exports = {
  unAuthorized,
  unAuthenticated,
  badRequest,
  notFound,
  formatServerError,
  AppError,
};
