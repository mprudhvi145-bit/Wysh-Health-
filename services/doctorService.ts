import { Doctor, Specialty } from '../types/doctor';
import { Prescription } from '../services/patientService';
import { config } from '../config';
import { authService } from './authService';

const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  return `${config.apiBaseUrl}`;
};

export interface LabOrder {
  id: string;
  patientId: string;
  testName?: string; // Legacy support
  tests?: string[]; // New array support
  category?: string;
  priority: 'Routine' | 'Urgent' | 'Stat';
  status: 'ORDERED' | 'Processing' | 'COMPLETED';
  dateOrdered?: string;
  createdAt?: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  doctorId: string;
  type?: string;
  subject?: string;
  content: string;
  shared: boolean;
  createdAt: string;
  isPrivate?: boolean; // UI Mapper
}

export interface ClinicalPatient {
  id: string;
  name: string;
  age?: number;
  dob?: string;
  bloodType?: string;
  allergies: string[];
  chronicConditions: string[];
  lastVisit: string;
  status: string;
  prescriptions?: Prescription[];
  labOrders?: LabOrder[];
  clinicalNotes?: ClinicalNote[];
}

export const doctorService = {
  
  // --- Public Directory ---
  getAllDoctors: async (specialty?: Specialty, search?: string): Promise<Doctor[]> => {
    // Mock for now as Directory is public
    return []; 
  },

  getDoctorById: async (id: string): Promise<Doctor | undefined> => {
    return undefined;
  },

  updateStatus: async (id: string, isOnline: boolean): Promise<void> => {
     console.log(`Doctor ${id} status: ${isOnline}`);
  },

  // --- Authenticated Clinical Workflows ---

  searchPatients: async (query: string): Promise<ClinicalPatient[]> => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/patients?query=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to search patients');
    const json = await res.json();
    return json.data;
  },

  getPatientDetails: async (id: string): Promise<ClinicalPatient> => {
    const token = authService.getToken();
    // Using the new Aggregated Chart Endpoint
    const res = await fetch(`${getBackendUrl()}/clinical/patients/${id}/chart`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch chart');
    
    const { data } = await res.json();
    
    // Flatten response to match UI expectation
    return {
      ...data.patient,
      prescriptions: data.prescriptions,
      labOrders: data.labOrders,
      clinicalNotes: data.clinicalNotes
    };
  },

  createPrescription: async (payload: { patientId: string, medications: any[], notes: string }) => {
    const token = authService.getToken();
    // Map 'medications' to 'items' for the new backend spec
    const body = {
      patientId: payload.patientId,
      items: payload.medications.map(m => ({
        medicine: m.name,
        dosage: m.dosage,
        frequency: m.frequency,
        duration: m.duration || '30 days'
      })),
      notes: payload.notes
    };

    const res = await fetch(`${getBackendUrl()}/clinical/prescriptions`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to prescribe');
    return await res.json();
  },

  orderLab: async (payload: { patientId: string, testName: string, category: string, priority: string }) => {
    const token = authService.getToken();
    const body = {
      patientId: payload.patientId,
      tests: [payload.testName], // Backend expects array of strings
      priority: payload.priority
    };

    const res = await fetch(`${getBackendUrl()}/clinical/labs/orders`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });
    if (!res.ok) throw new Error('Failed to order lab');
    return await res.json();
  },

  createNote: async (payload: { patientId: string, type: string, subject: string, content: string, isPrivate: boolean }) => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/notes`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to save note');
    return await res.json();
  }
};