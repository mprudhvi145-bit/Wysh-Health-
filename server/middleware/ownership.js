import { Repo } from "../modules/clinical/repo.js";

export const doctorOwnsPatient = async (req, res, next) => {
  // Skip check for patients accessing their own data (handled by 'mine' routes or separate logic)
  if (req.user.role !== 'doctor') return next();

  const doctorId = req.user.id;
  // Support both route params and body payloads
  const patientId = req.params.patientId || req.body.patientId;

  if (!patientId) {
    return res.status(400).json({ error: "Missing patient identifier" });
  }

  try {
    const hasAccess = await Repo.checkRelationship(doctorId, patientId);
    
    // In a real system, you might allow access if the patient explicitly shared data,
    // or if it's an emergency 'break-glass' scenario.
    if (!hasAccess) {
      return res.status(403).json({ error: "Access denied: Patient not assigned to your care" });
    }
    
    next();
  } catch (error) {
    console.error("Ownership check failed:", error);
    return res.status(500).json({ error: "Authorization check failed" });
  }
};