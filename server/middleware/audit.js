import { AuditService } from "../modules/audit/service.js";

export const audit = (action, resource) => (req, res, next) => {
  // defer logging until after response lifecycle or immediately but non-blocking
  setImmediate(() => {
    if (req.user && req.user.id) {
      AuditService.log(req.user.id, action, resource);
    }
  });
  next();
};