import { log } from "../lib/logger.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  
  // Generic message for production security
  const message = process.env.NODE_ENV === 'production' && status === 500
    ? "Internal Server Error" 
    : err.message || "Something went wrong";

  // Log error with context but NO PHI/Data
  log.error("Unhandled error processing request", {
    reqId: req.reqId,
    code: err.code,
    path: req.path,
    method: req.method,
    statusCode: status,
    errorMessage: err.message, // Log actual message internally
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined
  });

  res.status(status).json({ 
    error: message,
    code: err.code || 'INTERNAL_ERROR',
    // Include reqId for support tracing
    traceId: req.reqId 
  });
};