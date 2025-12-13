import { Repo } from "../clinical/repo.js";

// Mock ABDM Gateway Interactions
export const AbdmService = {
    // 1. Link ABHA
    async linkAbha(userId, abhaAddress, otp) {
        // Mock OTP Verification
        if (otp !== '123456') throw new Error("Invalid OTP");
        
        // Find patient ID based on User ID (Mock mapping)
        const patientId = userId === 'usr_pat_1' ? 'p1' : userId; 
        
        const abhaData = {
            id: '91-' + Math.floor(Math.random() * 10000000000000), // Random 14 digit
            address: abhaAddress
        };
        
        return Repo.linkAbha(patientId, abhaData);
    },

    // 2. Request OTP for Linking
    async requestOtp(abhaAddress) {
        // Simulate network delay
        await new Promise(r => setTimeout(r, 1000));
        return { success: true, message: "OTP sent to linked mobile number" };
    },

    // 3. Create Consent Artefact (HIU role)
    async createConsent(userId, payload) {
        const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
        return Repo.createConsent(patientId, payload);
    },

    // 4. Fetch Health Data (HIU role)
    async fetchHealthData(userId, consentId) {
        const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
        
        // Simulate data fetch from external HIP (e.g. Apollo) based on consent
        const mockExternalData = {
            patientId,
            source: 'Max Healthcare',
            type: 'OPD Prescription',
            date: new Date().toISOString().split('T')[0],
            summary: 'Prescribed antibiotics for bacterial infection.',
        };
        
        return Repo.addExternalRecord(mockExternalData);
    },

    // 5. Get My Consents
    async getConsents(userId) {
        const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
        const chart = Repo.getPatientChart(patientId);
        return chart.consents || [];
    }
};