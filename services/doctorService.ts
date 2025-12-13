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
  testName: string;
  category: string;
  priority: 'Routine' | 'Urgent' | 'Stat';
  status: 'Ordered' | 'Processing' | 'Completed';
  dateOrdered: string;
}

export interface ClinicalNote {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  type: string;
  subject: string;
  content: string;
  isPrivate: boolean;
  createdAt: string;
}

export interface ClinicalPatient {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  lastVisit: string;
  prescriptions?: Prescription[];
  labOrders?: LabOrder[];
  clinicalNotes?: ClinicalNote[];
}

export const doctorService = {
  
  // --- Doctor Directory (Public) ---
  getAllDoctors: async (specialty?: Specialty, search?: string): Promise<Doctor[]> => {
    // Mock public data
    await new Promise(r => setTimeout(r, 600));
    return []; 
  },

  getDoctorById: async (id: string): Promise<Doctor | undefined> => {
    await new Promise(r => setTimeout(r, 400));
    return undefined;
  },

  updateStatus: async (id: string, isOnline: boolean): Promise<void> => {
     console.log(`Doctor ${id} is now ${isOnline ? 'online' : 'offline'}`);
  },

  // --- Clinical Workflows (Authenticated Backend) ---

  searchPatients: async (query: string): Promise<ClinicalPatient[]> => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/patients?query=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to search patients');
    const data = await res.json();
    return data.data;
  },

  getPatientDetails: async (id: string): Promise<ClinicalPatient> => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/patients/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('Failed to fetch patient details');
    const data = await res.json();
    return data.data;
  },

  createPrescription: async (payload: { patientId: string, medications: any[], notes: string }) => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/prescriptions`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to create prescription');
    return await res.json();
  },

  orderLab: async (payload: { patientId: string, testName: string, category: string, priority: string }) => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/labs`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
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
    if (!res.ok) throw new Error('Failed to create note');
    return await res.json();
  }
};