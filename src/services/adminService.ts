
import { api } from './api';
import { config } from '../config';

export interface OpsMetrics {
    system: {
        uptime: number;
        errorRate: number;
        latency: number;
        otpSuccess: number;
    };
    usage: {
        activeDoctors: number;
        activePatients: number;
        consultationsToday: number;
    };
    consent: {
        totalRequests: number;
        approved: number;
        denied: number;
        violations: number; // Critical red flag
    };
    emergency: EmergencyEvent[];
}

export interface EmergencyEvent {
    id: string;
    timestamp: string;
    wyshId: string;
    location: string;
    duration: string;
    status: 'Safe' | 'Suspicious';
}

export const adminService = {
    getOpsMetrics: async (): Promise<OpsMetrics> => {
        if (config.dataMode === 'MOCK') {
            // Simulate live fluctuations
            return new Promise(resolve => setTimeout(() => resolve({
                system: {
                    uptime: 99.98,
                    errorRate: parseFloat((Math.random() * 0.5).toFixed(2)),
                    latency: 45 + Math.floor(Math.random() * 20),
                    otpSuccess: 98.5
                },
                usage: {
                    activeDoctors: 12,
                    activePatients: 450,
                    consultationsToday: 34
                },
                consent: {
                    totalRequests: 156,
                    approved: 142,
                    denied: 14,
                    violations: Math.random() > 0.9 ? 1 : 0 // Occasional simulated violation
                },
                emergency: [
                    { id: 'evt_1', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), wyshId: 'WYSH-****-9X82', location: 'IP 103.21.*** (Hyderabad)', duration: '4m 20s', status: 'Safe' },
                    { id: 'evt_2', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), wyshId: 'WYSH-****-3K11', location: 'IP 45.12.*** (Unknown)', duration: '0m 45s', status: 'Suspicious' },
                ]
            }), 600));
        }
        return api.get<OpsMetrics>('/admin/ops/metrics');
    },

    triggerKillSwitch: async (target: 'SHARING' | 'EMERGENCY' | 'ACCOUNT', id?: string) => {
        console.warn(`[AUDIT] Kill Switch Triggered: ${target} ${id ? 'on ' + id : 'GLOBAL'}`);
        if (config.dataMode === 'MOCK') return { success: true };
        return api.post('/admin/ops/kill-switch', { target, id });
    }
};
