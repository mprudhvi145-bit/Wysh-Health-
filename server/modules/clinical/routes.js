import { Router } from "express";
import { ClinicalController } from "./controller.js";
import { authRequired } from "../../middleware/auth.js";
import { requireRole } from "../../middleware/rbac.js";
import { doctorOwnsPatient } from "../../middleware/ownership.js";
import { audit } from "../../middleware/audit.js";
import { aiLimiter } from "../../middleware/limiter.js";

export const clinicalRouter = Router();

// Apply auth to all clinical routes
clinicalRouter.use(authRequired);

// --- Clinical Catalogs (Pillar 1) ---
clinicalRouter.get(
  "/catalogs",
  // Cache-Control headers could be added here in a real app
  ClinicalController.getCatalogs
);

// --- Patient Management ---
clinicalRouter.get(
  "/patients",
  requireRole("DOCTOR"),
  audit("VIEW", "patient_search"),
  ClinicalController.searchPatients
);

clinicalRouter.get(
  "/patients/:patientId/chart",
  requireRole("DOCTOR"),
  doctorOwnsPatient, 
  audit("VIEW", "patient_chart"),
  ClinicalController.getPatientChart
);

// --- Clinical Actions ---
clinicalRouter.post(
  "/prescriptions",
  requireRole("DOCTOR"),
  doctorOwnsPatient,
  audit("CREATE", "prescription"),
  ClinicalController.createPrescription
);

clinicalRouter.post(
  "/labs/orders",
  requireRole("DOCTOR"),
  doctorOwnsPatient,
  audit("CREATE", "lab_order"),
  ClinicalController.createLabOrder
);

clinicalRouter.post(
  "/notes",
  requireRole("DOCTOR"),
  doctorOwnsPatient,
  audit("CREATE", "clinical_note"),
  ClinicalController.addNote
);

// --- Appointment Workflows ---
clinicalRouter.get(
    "/appointments",
    ClinicalController.getAppointments
);

clinicalRouter.get(
  "/appointments/:id",
  ClinicalController.getAppointmentById
);

clinicalRouter.post(
    "/appointments",
    audit("CREATE", "appointment"),
    ClinicalController.createAppointment
);

clinicalRouter.post(
  "/appointments/:id/start",
  requireRole("DOCTOR"),
  audit("UPDATE", "appointment_start"),
  ClinicalController.startAppointment
);

clinicalRouter.post(
  "/appointments/:id/close",
  requireRole("DOCTOR"),
  audit("UPDATE", "appointment_close"),
  ClinicalController.closeAppointment
);

// --- Patient Views (The 'Mine' endpoints) ---
clinicalRouter.get(
  "/prescriptions/mine", 
  requireRole("PATIENT"),
  audit("VIEW", "my_prescriptions"),
  ClinicalController.getMyPrescriptions
);

clinicalRouter.get(
  "/labs/mine", 
  requireRole("PATIENT"),
  audit("VIEW", "my_labs"),
  ClinicalController.getMyLabs
);

// --- Secure Document Access & AI ---

// Securely get a temporary signed URL for a file
clinicalRouter.get(
  "/documents/:id/access",
  audit("ACCESS", "document_file"),
  ClinicalController.getFileAccess
);

clinicalRouter.get(
  "/documents/:id/ai",
  aiLimiter, // Specific limit for AI retrieval
  audit("AI_ACCESS", "document_ai"),
  ClinicalController.getAIInsight
);