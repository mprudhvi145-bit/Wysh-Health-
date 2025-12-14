
import { Router } from "express";
import { ConsentController } from "./controller.js";
import { jwtAuthGuard, roleGuard } from "../../middleware/guards.js";
import { audit } from "../../middleware/audit.js";

export const consentRouter = Router();

consentRouter.use(jwtAuthGuard);

// Doctor requests access
consentRouter.post(
  "/request",
  roleGuard("doctor"),
  audit("REQUEST_ACCESS", "consent_engine"),
  ConsentController.requestConsent
);

// Patient approves
consentRouter.post(
  "/approve",
  roleGuard("patient"),
  audit("GRANT_ACCESS", "consent_engine"),
  ConsentController.approveConsent
);

// List active
consentRouter.get(
  "/active",
  ConsentController.getActive
);
