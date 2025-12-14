
import { config } from '../config';

const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api/emergency';
  }
  return `${config.apiBaseUrl}/emergency`;
};

export interface EmergencyProfile {
    name: string;
    avatar: string;
    bloodGroup: string;
    wyshId: string;
    emergencyContacts: {
        primary: string;
        relationship: string;
        secondary: string;
    };
    medicalAlerts: {
        allergies: string[];
        conditions: string[];
        currentMeds: string[];
        notes: string;
    }
}

export const emergencyService = {
    getPublicProfile: async (wyshId: string): Promise<EmergencyProfile> => {
        const response = await fetch(`${getBackendUrl()}/${wyshId}`);
        if (!response.ok) throw new Error("Emergency profile not found or access denied.");
        const json = await response.json();
        return json.data;
    }
};
