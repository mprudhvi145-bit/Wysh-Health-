
import { log } from "../lib/logger.js";

export const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';
  
  // Determine if error is user-safe (intentional domain error) or technical (crash)
  // We assume custom errors with 'userSafe' property or 4xx status codes are safe.
  const isUserSafe = err.userSafe || (status >= 400 && status < 500);

  // Generic message for production security on 500s
  const message = (isProduction && !isUserSafe)
    ? "Internal System Error. Reference Trace ID." 
    : err.message || "Something went wrong";

  const code = err.code || (status === 500 ? 'INTERNAL_ERROR' : 'BAD_REQUEST');

  // Log full context internally
  log.error("Request Failed", {
    reqId: req.reqId,
    code: code,
    path: req.path,
    method: req.method,
    statusCode: status,
    errorMessage: err.message, 
    stack: isProduction ? undefined : err.stack
  });

  res.status(status).json({ 
    error: {
      message: message,
      code: code,
      userSafe: isUserSafe,
      traceId: req.reqId 
    }
  });
};
