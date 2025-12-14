
import { Router } from "express";
import { AIController } from "./controller.js";
import { authRequired } from "../../middleware/auth.js";
import { aiLimiter } from "../../middleware/limiter.js";
import { audit } from "../../middleware/audit.js";

export const aiRouter = Router();

aiRouter.use(authRequired);
aiRouter.use(aiLimiter);

aiRouter.post(
    "/ingest/:documentId",
    audit("AI_INGEST", "document"),
    AIController.ingestDocument
);

aiRouter.get(
    "/health/overview",
    audit("VIEW_INSIGHTS", "health_profile"),
    AIController.getHealthOverview
);
