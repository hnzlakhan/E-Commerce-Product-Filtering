export const NotFoundHandler = (req, res, next) => {
  res.statusCode = 404;
  throw new Error("Api path doesn't exist");
};

export const ErrorHandler = (error, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.statusCode = statusCode;
  return res.json({
    message: error.message,
    stack: process.env.NODE_MODE === 'development' ? error.stack : null,
  });
};
