import { api } from '../../../services/api';

export const patientClinicalService = {
  getPrescriptions() {
    return api.get<any[]>("/clinical/prescriptions/mine");
  },
  getLabs() {
    return api.get<any[]>("/clinical/labs/mine");
  },
  getAppointmentSummary(appointmentId: string) {
    return api.get<any>(`/clinical/appointments/${appointmentId}`);
  },
};