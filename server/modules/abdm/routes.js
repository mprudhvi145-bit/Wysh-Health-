import { Router } from "express";
import { AbdmController } from "./controller.js";
import { authRequired } from "../../middleware/auth.js";
import { audit } from "../../middleware/audit.js";

export const abdmRouter = Router();

abdmRouter.use(authRequired);

abdmRouter.post(
    "/link/otp", 
    AbdmController.requestOtp
);

abdmRouter.post(
    "/link/confirm", 
    audit("ABHA_LINK", "identity"),
    AbdmController.linkAbha
);

abdmRouter.get(
    "/consents",
    AbdmController.getConsents
);

abdmRouter.post(
    "/consents",
    audit("CONSENT_GRANT", "abdm_consent"),
    AbdmController.createConsent
);

abdmRouter.post(
    "/fetch",
    audit("DATA_FETCH", "external_records"),
    AbdmController.fetchExternalData
);