
import { Router } from "express";
import { AbdmController } from "./controller.js";
import { AbdmCallbackController } from "./callbacks.js";
import { authRequired } from "../../middleware/auth.js";
import { audit } from "../../middleware/audit.js";

export const abdmRouter = Router();

// --- Internal App Routes (Secured) ---
abdmRouter.use(authRequired);

abdmRouter.post("/link/otp", AbdmController.requestOtp);
abdmRouter.post("/link/confirm", audit("ABHA_LINK", "identity"), AbdmController.linkAbha);
abdmRouter.get("/consents", AbdmController.getConsents);
abdmRouter.post("/consents", audit("CONSENT_GRANT", "abdm_consent"), AbdmController.createConsent);
abdmRouter.post("/fetch", audit("DATA_FETCH", "external_records"), AbdmController.fetchExternalData);

// --- Gateway Callback Routes (Public/Webhook) ---
// These mimic the structure ABDM Gateway sends.
// In prod, mount these on a separate public path or use signature validation middleware.
const webhookRouter = Router();

webhookRouter.post("/v0.5/consent/on-init", AbdmCallbackController.onConsentInit);
webhookRouter.post("/v0.5/consents/hip/notify", AbdmCallbackController.onConsentNotify);
webhookRouter.post("/v0.5/health-information/hip/request", AbdmCallbackController.onHealthInformationRequest);
webhookRouter.post("/v0.5/health-information/notify", AbdmCallbackController.onDataPush); // Data Push Callback

// Mount webhooks
abdmRouter.use("/callbacks", webhookRouter);
