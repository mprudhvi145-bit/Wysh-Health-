import { AbdmService } from "./service.js";

export const AbdmController = {
    async requestOtp(req, res) {
        try {
            const { abhaAddress } = req.body;
            await AbdmService.requestOtp(abhaAddress);
            res.json({ success: true, message: "OTP Sent" });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async linkAbha(req, res) {
        try {
            const { abhaAddress, otp } = req.body;
            const profile = await AbdmService.linkAbha(req.user.id, abhaAddress, otp);
            res.json({ success: true, data: profile });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async createConsent(req, res) {
        try {
            const result = await AbdmService.createConsent(req.user.id, req.body);
            res.json({ success: true, data: result });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async getConsents(req, res) {
        try {
            const data = await AbdmService.getConsents(req.user.id);
            res.json({ data });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    },

    async fetchExternalData(req, res) {
        try {
            const { consentId } = req.body;
            const data = await AbdmService.fetchHealthData(req.user.id, consentId);
            res.json({ success: true, data });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    }
};