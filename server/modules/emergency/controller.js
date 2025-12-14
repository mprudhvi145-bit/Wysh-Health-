
import { EmergencyService } from "./service.js";

export const EmergencyController = {
  async getProfile(req, res) {
    try {
      const { wyshId } = req.params;
      
      // Log first (Audit Trail is critical here)
      await EmergencyService.logEmergencyAccess(wyshId, {
        ip: req.ip,
        userAgent: req.get('user-agent')
      });

      const profile = await EmergencyService.getProfile(wyshId);
      res.json({ data: profile });
    } catch (e) {
      res.status(404).json({ error: "Emergency profile not found" });
    }
  }
};
