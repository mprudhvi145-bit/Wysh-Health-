import { api } from '../../../services/api';

export interface CreatePrescriptionPayload {
  patientId: string;
  items: Array<{ medicine: string; dosage: string; frequency: string; duration: string }>;
  notes?: string;
}

export interface CreateLabOrderPayload {
  patientId: string;
  tests: string[];
  priority?: string;
  category?: string; // specific to UI form
}

export interface CreateNotePayload {
  patientId: string;
  content: string;
  subject?: string;
  type?: string;
  shared?: boolean;
}

export interface CloseAppointmentPayload {
  diagnosis: string;
  notes: string;
  followUp?: string;
}

export const clinicalService = {
  searchPatients: (query = "") => {
    return api.get<any[]>("/clinical/patients", { query });
  },

  getPatientChart: (patientId: string) => {
    return api.get<any>(`/clinical/patients/${patientId}/chart`);
  },

  createPrescription: (payload: CreatePrescriptionPayload) => {
    return api.post("/clinical/prescriptions", payload);
  },

  createLabOrder: (payload: CreateLabOrderPayload) => {
    return api.post("/clinical/labs/orders", payload);
  },

  addNote: (payload: CreateNotePayload) => {
    return api.post("/clinical/notes", payload);
  },

  closeAppointment: (appointmentId: string, payload: CloseAppointmentPayload) => {
    return api.post(`/clinical/appointments/${appointmentId}/close`, payload);
  },
};