
import { Doctor, Specialty } from '../types/doctor';
import { Prescription } from '../services/patientService';
import { config } from '../config';
import { authService } from './authService';
import { MOCK_DOCTORS } from '../utils/constants';

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
  abha?: {
    id: string;
    address: string;
    status: string;
  };
}

export const doctorService = {
  
  // --- Public Directory ---
  getAllDoctors: async (specialty?: Specialty, search?: string): Promise<Doctor[]> => {
    // Directory is public, can use Mock always if needed, but respecting mode:
    if (config.dataMode === 'MOCK') {
        let docs = MOCK_DOCTORS;
        if (specialty && specialty !== 'All') {
            docs = docs.filter(d => d.specialty === specialty);
        }
        if (search) {
            docs = docs.filter(d => d.name.toLowerCase().includes(search.toLowerCase()) || d.specialty.toLowerCase().includes(search.toLowerCase()));
        }
        return docs;
    }
    // Real implementation would fetch from API
    return MOCK_DOCTORS; 
  },

  getDoctorById: async (id: string): Promise<Doctor | undefined> => {
    if (config.dataMode === 'MOCK') {
        return MOCK_DOCTORS.find(d => d.id === id);
    }
    // Stub for API
    return MOCK_DOCTORS.find(d => d.id === id);
  },

  updateStatus: async (id: string, isOnline: boolean): Promise<void> => {
     console.log(`Doctor ${id} status: ${isOnline}`);
  },

  // --- Authenticated Clinical Workflows ---

  searchPatients: async (query: string): Promise<ClinicalPatient[]> => {
    if (config.dataMode === 'MOCK') {
        // Return a mock patient for search
        return [{
            id: 'p1', name: 'Alex Doe', age: 34, bloodType: 'O+', allergies: ['Peanuts'], 
            chronicConditions: ['Arrhythmia'], lastVisit: '2024-10-12', status: 'Stable',
            abha: { id: '91-xxxx', address: 'alex@abdm', status: 'LINKED' }
        }].filter(p => !query || p.name.toLowerCase().includes(query.toLowerCase()));
    }

    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/patients?query=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to search patients');
    const json = await res.json();
    return json.data;
  },

  getPatientDetails: async (id: string): Promise<ClinicalPatient> => {
    if (config.dataMode === 'MOCK') {
        return {
            id: 'p1', name: 'Alex Doe', age: 34, bloodType: 'O+', allergies: ['Peanuts'], 
            chronicConditions: ['Arrhythmia'], lastVisit: '2024-10-12', status: 'Stable',
            prescriptions: [], labOrders: [], clinicalNotes: [],
            abha: { id: '91-xxxx', address: 'alex@abdm', status: 'LINKED' }
        };
    }

    const token = authService.getToken();
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
    if (config.dataMode === 'MOCK') return { success: true };

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
    if (config.dataMode === 'MOCK') return { success: true };

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
    if (config.dataMode === 'MOCK') return { success: true };

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
