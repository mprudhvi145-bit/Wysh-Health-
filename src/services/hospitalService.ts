
import { api } from './api';

export interface HospitalMetrics {
    patients: number;
    appointmentsToday: number;
    activeDoctors: number;
    occupancy: string;
}

export const hospitalService = {
    getMetrics: async (): Promise<HospitalMetrics> => {
        try {
            // Mock response if backend route isn't fully wired in `api/hospital` yet
            // return api.get<HospitalMetrics>('/hospital/metrics');
            return new Promise(resolve => setTimeout(() => resolve({
                patients: 1240,
                appointmentsToday: 85,
                activeDoctors: 12,
                occupancy: '85%'
            }), 800));
        } catch(e) {
            return { patients: 0, appointmentsToday: 0, activeDoctors: 0, occupancy: '0%' };
        }
    }
};
