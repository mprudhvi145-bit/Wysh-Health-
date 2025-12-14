
import { api } from './api';
import { config } from '../config';

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
    status: 'GRANTED' | 'REVOKED' | 'EXPIRED' | 'REQUESTED';
    dateGranted: string;
    expiresAt: string;
    scope?: string[];
    dateFrom?: string;
    dateTo?: string;
    requester?: string;
}

export const abdmService = {
    requestOtp: (abhaAddress: string) => {
        return api.post("/abdm/link/otp", { abhaAddress });
    },

    linkAbha: (abhaAddress: string, otp: string) => {
        return api.post<{ success: boolean, data: AbhaProfile }>("/abdm/link/confirm", { abhaAddress, otp });
    },

    getConsents: async (): Promise<ConsentArtifact[]> => {
        if (config.dataMode === 'MOCK') {
            const hasRequest = localStorage.getItem('demo_consent_request') === 'pending';
            const status = localStorage.getItem('demo_consent_status') || 'REQUESTED';
            
            if (hasRequest) {
                return [{
                    id: 'req_123',
                    purpose: 'Care Management',
                    hipName: 'Dr. Sarah Chen',
                    requester: 'Dr. Sarah Chen',
                    status: status === 'granted' ? 'GRANTED' : 'REQUESTED',
                    dateGranted: new Date().toISOString(),
                    expiresAt: new Date(Date.now() + 86400000).toISOString()
                }];
            }
            return [];
        }
        return api.get<ConsentArtifact[]>("/abdm/consents");
    },

    approveConsent: async (id: string) => {
        if (config.dataMode === 'MOCK') {
            localStorage.setItem('demo_consent_status', 'granted');
            return { success: true };
        }
        return api.post('/consent/approve', { requestId: id });
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
