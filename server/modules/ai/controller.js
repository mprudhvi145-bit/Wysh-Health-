
import { AIService } from "./service.js";

export const AIController = {
  async ingestDocument(req, res) {
    try {
      const { documentId } = req.params;
      const result = await AIService.ingestDocument(documentId, req.user.id);
      res.json({ success: true, data: result });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async getHealthOverview(req, res) {
    try {
      const data = await AIService.getHealthOverview(req.user.id);
      res.json({ data });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
