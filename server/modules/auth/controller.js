
import { AuthService } from "./service.js";

export const AuthController = {
  async requestOtp(req, res) {
    try {
      const { identifier } = req.body;
      if (!identifier) return res.status(400).json({ error: "Identifier (email/phone) required" });
      const result = await AuthService.requestOtp(identifier);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  },

  async verifyOtp(req, res) {
    try {
      const { identifier, code } = req.body;
      if (!identifier || !code) return res.status(400).json({ error: "Identifier and code required" });
      const result = await AuthService.verifyOtp(identifier, code);
      res.json(result);
    } catch (e) {
      res.status(401).json({ error: e.message });
    }
  },

  async getMe(req, res) {
    try {
      const user = await AuthService.getMe(req.user.id);
      res.json({ user });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
};
