
import { api } from '../../../services/api';
import { config } from '../../../config';

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

// Mock Data
const MOCK_CATALOGS = {
  medications: [
    { id: 'med_1', name: 'Metoprolol', strength: '50mg', form: 'Tablet', isGeneric: true },
    { id: 'med_2', name: 'Amoxicillin', strength: '500mg', form: 'Capsule', isGeneric: true },
    { id: 'med_3', name: 'Lisinopril', strength: '10mg', form: 'Tablet', isGeneric: true },
    { id: 'med_4', name: 'Atorvastatin', strength: '20mg', form: 'Tablet', isGeneric: true },
    { id: 'med_5', name: 'Metformin', strength: '500mg', form: 'Tablet', isGeneric: true },
    { id: 'med_6', name: 'Albuterol', strength: '90mcg', form: 'Inhaler', isGeneric: true },
    { id: 'med_7', name: 'Ibuprofen', strength: '400mg', form: 'Tablet', isGeneric: true },
  ],
  labTests: [
    { id: 'lab_t1', code: 'CBC', name: 'Complete Blood Count', units: 'n/a' },
    { id: 'lab_t2', code: 'LIPID', name: 'Lipid Panel', units: 'mg/dL' },
    { id: 'lab_t3', code: 'TSH', name: 'Thyroid Stimulating Hormone', units: 'mIU/L' },
    { id: 'lab_t4', code: 'CMP', name: 'Comprehensive Metabolic Panel', units: 'n/a' },
    { id: 'lab_t5', code: 'HBA1C', name: 'Hemoglobin A1c', units: '%' },
  ],
  services: [
    { id: 'srv_1', name: 'General Consultation', category: 'Consultation', code: '99203' },
    { id: 'srv_2', name: 'Follow-up Visit', category: 'Consultation', code: '99213' },
    { id: 'srv_3', name: 'Telemedicine Consult', category: 'Telehealth', code: '99442' },
  ]
};

const MOCK_PATIENT_CHART = {
    patient: { 
        id: 'p1', name: 'Alex Doe', age: 34, dob: '1990-05-20', bloodType: 'O+', 
        allergies: ['Peanuts'], chronicConditions: ['Arrhythmia'], lastVisit: '2024-10-12', 
        status: 'Stable',
        abha: { id: '91-2345-6789-1234', address: 'alex.doe@abdm', status: 'LINKED' }
    },
    problems: [{ id: 'pr1', diagnosis: 'Arrhythmia', status: 'Active', onset: '2023-01-15' }],
    appointments: [],
    prescriptions: [],
    labOrders: [],
    clinicalNotes: [],
    documents: []
};

export const clinicalService = {
  getCatalogs: async () => {
    if (config.dataMode === 'MOCK') return MOCK_CATALOGS;
    return api.get<any>("/clinical/catalogs");
  },

  searchPatients: async (query = "") => {
    if (config.dataMode === 'MOCK') {
        // Return mock list filtered by query
        return [MOCK_PATIENT_CHART.patient].filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()));
    }
    return api.get<any[]>("/clinical/patients", { query });
  },

  getPatientChart: async (patientId: string) => {
    if (config.dataMode === 'MOCK') return MOCK_PATIENT_CHART;
    return api.get<any>(`/clinical/patients/${patientId}/chart`);
  },

  createPrescription: async (payload: CreatePrescriptionPayload) => {
    if (config.dataMode === 'MOCK') return { id: `rx_${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
    return api.post("/clinical/prescriptions", payload);
  },

  createLabOrder: async (payload: CreateLabOrderPayload) => {
    if (config.dataMode === 'MOCK') return { id: `lab_${Date.now()}`, ...payload, status: 'ORDERED', createdAt: new Date().toISOString() };
    return api.post("/clinical/labs/orders", payload);
  },

  addNote: async (payload: CreateNotePayload) => {
    if (config.dataMode === 'MOCK') return { id: `note_${Date.now()}`, ...payload, createdAt: new Date().toISOString() };
    return api.post("/clinical/notes", payload);
  },

  startAppointment: async (appointmentId: string) => {
    if (config.dataMode === 'MOCK') return { success: true };
    return api.post(`/clinical/appointments/${appointmentId}/start`, {});
  },

  closeAppointment: async (appointmentId: string, payload: CloseAppointmentPayload) => {
    if (config.dataMode === 'MOCK') return { success: true };
    return api.post(`/clinical/appointments/${appointmentId}/close`, payload);
  },
};
