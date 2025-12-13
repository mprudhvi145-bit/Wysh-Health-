import { ClinicalService } from "./service.js";

export const ClinicalController = {
  searchPatients(req, res) {
    const { query = "" } = req.query;
    const data = ClinicalService.searchPatients(query);
    res.json({ data }); // Consistent envelope
  },

  getPatientChart(req, res) {
    const data = ClinicalService.getPatientChart(req.params.patientId);
    if (!data.patient) return res.status(404).json({ error: "Patient not found" });
    res.json({ data });
  },

  createPrescription(req, res) {
    const doctorId = 'doc_1'; // In real app: req.user.doctorProfileId
    const result = ClinicalService.createPrescription(req.body, doctorId);
    res.status(201).json({ data: result });
  },

  createLabOrder(req, res) {
    const doctorId = 'doc_1'; 
    const result = ClinicalService.createLabOrder(req.body, doctorId);
    res.status(201).json({ data: result });
  },

  addNote(req, res) {
    const doctorId = 'doc_1'; 
    const result = ClinicalService.addNote(req.body, doctorId);
    res.status(201).json({ data: result });
  },

  closeAppointment(req, res) {
    try {
        const result = ClinicalService.closeAppointment(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
  },

  // Appointment endpoints (shared/doctor/patient)
  getAppointments(req, res) {
      const results = ClinicalService.getAppointments(req.user.role, req.user.id);
      res.json({ data: results });
  },

  createAppointment(req, res) {
      const result = ClinicalService.createAppointment(req.body);
      res.status(201).json({ data: result });
  },

  getMyPrescriptions(req, res) {
    const data = ClinicalService.getPrescriptionsForPatient(req.user.id);
    res.json({ data });
  },

  getMyLabs(req, res) {
    const data = ClinicalService.getLabsForPatient(req.user.id);
    res.json({ data });
  },

  getAppointmentById(req, res) {
    const data = ClinicalService.getAppointmentById(req.params.id);
    if (!data) return res.status(404).json({error: "Appointment not found"});
    res.json({ data });
  }
};