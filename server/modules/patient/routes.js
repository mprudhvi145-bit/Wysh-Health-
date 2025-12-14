
import { Router } from "express";
import { PatientController } from "./controller.js";
import { authRequired } from "../../middleware/auth.js";
import { audit } from "../../middleware/audit.js";
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });
export const patientRouter = Router();

patientRouter.use(authRequired);

// Profile
patientRouter.get("/me", PatientController.getMe);

// Records
patientRouter.get("/records", audit("VIEW", "health_records"), PatientController.getRecords);
patientRouter.post("/records", upload.single('file'), audit("UPLOAD", "document"), PatientController.uploadRecord);
patientRouter.patch("/records/:id/hide", audit("HIDE", "document"), PatientController.hideRecord);
patientRouter.post("/records/:id/share", audit("SHARE", "document"), PatientController.shareRecord);

// Emergency
patientRouter.post("/emergency", audit("UPDATE", "emergency_profile"), PatientController.updateEmergency);
