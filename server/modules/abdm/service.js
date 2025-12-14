
import { Repo } from "../clinical/repo.js";
import { AbdmMapper } from "./mapper.js";
import { AbdmGateway } from "./gateway.js";
import { randomUUID } from "crypto";

// This service is the "Thin Adapter" requested in Step 11.
// It bridges internal business logic with the external ABDM network.

export const AbdmService = {
    // --- 1. Consent Flow ---
    
    async initConsentRequest(userId, payload) {
        // 1. Get Patient Context
        const patientChart = await Repo.getPatientChart(userId === 'usr_pat_1' ? 'p1' : userId);
        if (!patientChart || !patientChart.patient?.abha) {
            throw new Error("Patient ABHA not linked");
        }

        // 2. Prepare Internal Record
        const requestId = randomUUID();
        const consentData = {
            requestId,
            patientAbhaAddress: patientChart.patient.abha.address,
            purposeCode: payload.purpose, // "CAREMGT"
            dateFrom: payload.dateFrom,
            dateTo: payload.dateTo,
            hipId: payload.hipName // Assuming this resolves to an ID in UI
        };

        // 3. Map to ABDM Schema
        const abdmPayload = AbdmMapper.toConsentRequest(consentData);

        // 4. Send to Gateway
        await AbdmGateway.post('/v0.5/consent-requests/init', abdmPayload);

        // 5. Persist Request State (Pending)
        // In a real DB, we store the `requestId` to match the callback later
        return Repo.createConsent(patientChart.patient.id, {
            ...payload,
            requestId: requestId,
            status: 'REQUESTED'
        });
    },

    // --- 2. Data Flow ---

    async fetchHealthData(userId, consentId) {
        // 1. Trigger Data Flow
        const transactionId = randomUUID();
        
        // 2. Map Payload
        const abdmPayload = AbdmMapper.toHealthInformationRequest(transactionId, consentId);

        // 3. Send to Gateway
        await AbdmGateway.post('/v0.5/health-information/cm/request', abdmPayload);

        // 4. Mock Instant Data Arrival (Since Sandbox Callbacks are async)
        // In prod, this happens via the /data/push callback only.
        const mockData = {
            patientId: userId === 'usr_pat_1' ? 'p1' : userId,
            source: 'Max Healthcare',
            type: 'OPD Prescription',
            date: new Date().toISOString().split('T')[0],
            summary: 'Prescribed antibiotics for bacterial infection (Fetched via ABDM).',
        };
        return Repo.addExternalRecord(mockData);
    },

    // --- 3. Identity ---

    async linkAbha(userId, abhaAddress, otp) {
        if (otp !== '123456') throw new Error("Invalid OTP");
        const patientId = userId === 'usr_pat_1' ? 'p1' : userId; 
        const abhaData = {
            id: '91-' + Math.floor(Math.random() * 10000000000000), 
            address: abhaAddress
        };
        return Repo.linkAbha(patientId, abhaData);
    },

    async requestOtp(abhaAddress) {
        // Gateway Call for OTP (Auth Init)
        await AbdmGateway.post('/v0.5/users/auth/init', { id: abhaAddress, authMode: 'MOBILE_OTP' });
        return { success: true, message: "OTP sent" };
    },

    async getConsents(userId) {
        const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
        const chart = Repo.getPatientChart(patientId);
        return chart.consents || [];
    }
};
