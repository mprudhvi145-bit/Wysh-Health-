
import { ConsentService } from "./service.js";

export const ConsentController = {
  async requestConsent(req, res) {
    try {
      const { patientId, scope, reason } = req.body;
      const result = await ConsentService.requestConsent(req.user.id, patientId, scope, reason);
      res.json({ success: true, data: result });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async approveConsent(req, res) {
    try {
      const { requestId } = req.body;
      const result = await ConsentService.approveConsent(req.user.id, requestId);
      res.json({ success: true, data: result });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  },

  async getActive(req, res) {
    try {
      const data = await ConsentService.getActiveConsents(req.user.id, req.user.role);
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
