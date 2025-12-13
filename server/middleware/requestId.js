import { randomUUID } from "crypto";

export function requestId(req, res, next) {
  const id = randomUUID();
  req.reqId = id;
  res.setHeader("X-Request-Id", id);
  next();
}