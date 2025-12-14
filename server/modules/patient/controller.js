
import { PatientService } from "./service.js";

export const PatientController = {
  async getMe(req, res) {
    try {
      const data = await PatientService.getProfile(req.user.id);
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getRecords(req, res) {
    try {
      const data = await PatientService.getRecords(req.user.id);
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async uploadRecord(req, res) {
    try {
      const { type, date } = req.body;
      const file = req.file; // From multer
      const data = await PatientService.uploadRecord(req.user.id, file, type, date);
      res.status(201).json({ success: true, data });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async hideRecord(req, res) {
    try {
      await PatientService.hideRecord(req.user.id, req.params.id);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async shareRecord(req, res) {
    try {
      const result = await PatientService.generateShareLink(req.user.id, req.params.id);
      res.json({ success: true, data: result });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async updateEmergency(req, res) {
    try {
        const result = await PatientService.updateEmergencyProfile(req.user.id, req.body);
        res.json({ success: true, data: result });
    } catch (e) {
        res.status(400).json({ error: e.message });
    }
  }
};
