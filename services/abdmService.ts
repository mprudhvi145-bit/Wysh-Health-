
import { api } from './api';

export interface AbhaProfile {
    id: string;
    address: string;
    status: string;
    linkedAt: string;
}

export interface ConsentArtifact {
    id: string;
    purpose: string;
    hipName: string;
    status: 'GRANTED' | 'REVOKED' | 'EXPIRED';
    dateGranted: string;
    expiresAt: string;
    scope?: string[];
    dateFrom?: string;
    dateTo?: string;
}

export const abdmService = {
    requestOtp: (abhaAddress: string) => {
        return api.post("/abdm/link/otp", { abhaAddress });
    },

    linkAbha: (abhaAddress: string, otp: string) => {
        return api.post<{ success: boolean, data: AbhaProfile }>("/abdm/link/confirm", { abhaAddress, otp });
    },

    getConsents: () => {
        return api.get<ConsentArtifact[]>("/abdm/consents");
    },

    createConsent: (payload: { 
        hipName: string; 
        purpose: string; 
        scope: string[]; 
        dateFrom: string; 
        dateTo: string; 
    }) => {
        return api.post("/abdm/consents", payload);
    },

    fetchExternalData: (consentId: string) => {
        return api.post("/abdm/fetch", { consentId });
    }
};
