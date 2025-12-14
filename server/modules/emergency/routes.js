
import { Router } from "express";
import { EmergencyController } from "./controller.js";
import { globalLimiter } from "../../middleware/limiter.js";

export const emergencyRouter = Router();

// Public endpoint, heavily rate limited, strict logging
emergencyRouter.get(
  "/:wyshId",
  globalLimiter,
  EmergencyController.getProfile
);
