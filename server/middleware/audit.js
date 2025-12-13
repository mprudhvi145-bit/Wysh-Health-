import { AuditService } from "../modules/audit/service.js";

/**
 * Audit Middleware
 * @param {string} action - Action name (e.g. CREATE, VIEW)
 * @param {string} resource - Resource name (e.g. PATIENT, ABHA)
 * @param {function} metadataExtractor - Optional function to extract metadata from req (req => object)
 */
export const audit = (action, resource, metadataExtractor = null) => (req, res, next) => {
  // defer logging until after response lifecycle or immediately but non-blocking
  setImmediate(() => {
    if (req.user && req.user.id) {
      let metadata = null;
      if (metadataExtractor) {
          try {
              metadata = metadataExtractor(req);
          } catch(e) {
              console.warn("Audit metadata extraction failed", e);
          }
      }
      
      // Auto-extract consent_id if present in body for ABDM requests
      if (!metadata && req.body && req.body.consentId) {
          metadata = { consentId: req.body.consentId };
      }

      AuditService.log(req.user.id, action, resource, metadata);
    }
  });
  next();
};