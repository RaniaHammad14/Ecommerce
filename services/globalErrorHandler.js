export const globalErrorHandling = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({ msg: "Error", err: err.message, stack: err.stack });
};

export default globalErrorHandling;
