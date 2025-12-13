export const errorHandler = (err, req, res, next) => {
  console.error(`[Global Error] ${err.stack}`);

  // Determine status code
  const status = err.status || 500;
  
  // Generic message for production security, specific for dev if needed
  const message = process.env.NODE_ENV === 'production' 
    ? "Internal Server Error" 
    : err.message || "Something went wrong";

  res.status(status).json({ 
    error: message,
    code: err.code || 'INTERNAL_ERROR'
  });
};