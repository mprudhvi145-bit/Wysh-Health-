import { ClinicalService } from "./service.js";

export const ClinicalController = {
  async searchPatients(req, res) {
    const { query = "" } = req.query;
    const data = await ClinicalService.searchPatients(query);
    res.json({ data });
  },

  async getPatientChart(req, res) {
    const data = await ClinicalService.getPatientChart(req.params.patientId, req.user.role);
    if (!data.patient) return res.status(404).json({ error: "Patient not found" });
    res.json({ data });
  },

  async createPrescription(req, res) {
    const doctorId = 'doc_1'; 
    const result = await ClinicalService.createPrescription(req.body, doctorId);
    res.status(201).json({ data: result });
  },

  async createLabOrder(req, res) {
    const doctorId = 'doc_1'; 
    const result = await ClinicalService.createLabOrder(req.body, doctorId);
    res.status(201).json({ data: result });
  },

  async addNote(req, res) {
    const doctorId = 'doc_1'; 
    const result = await ClinicalService.addNote(req.body, doctorId);
    res.status(201).json({ data: result });
  },

  async startAppointment(req, res) {
    try {
        const result = await ClinicalService.startAppointment(req.params.id);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
  },

  async closeAppointment(req, res) {
    try {
        const result = await ClinicalService.closeAppointment(req.params.id, req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
  },

  async getAppointments(req, res) {
      const results = await ClinicalService.getAppointments(req.user.role, req.user.id);
      res.json({ data: results });
  },

  async createAppointment(req, res) {
      const result = await ClinicalService.createAppointment(req.body);
      res.status(201).json({ data: result });
  },

  async getMyPrescriptions(req, res) {
    const data = await ClinicalService.getPrescriptionsForPatient(req.user.id);
    res.json({ data });
  },

  async getMyLabs(req, res) {
    const data = await ClinicalService.getLabsForPatient(req.user.id);
    res.json({ data });
  },

  async getAppointmentById(req, res) {
    const data = await ClinicalService.getAppointmentById(req.params.id);
    if (!data) return res.status(404).json({error: "Appointment not found"});
    res.json({ data });
  },

  async getAIInsight(req, res) {
      try {
          const data = await ClinicalService.getAIInsight(req.params.id, req.user);
          if (!data) return res.status(404).json({ error: "No AI insights available for this document" });
          res.json({ data });
      } catch (error) {
          res.status(error.status || 500).json({ error: error.message || "Internal Error" });
      }
  }
};