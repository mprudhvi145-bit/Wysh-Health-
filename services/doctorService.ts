import { Doctor, Specialty } from '../types/doctor';
import { Prescription } from '../services/patientService';
import { config } from '../config';
import { authService } from './authService';

// Determine backend URL
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

export interface ClinicalPatient extends Doctor { 
  // reusing Doctor type loosely or better to define separate
  prescriptions?: Prescription[];
  labOrders?: LabOrder[];
}

export const doctorService = {
  
  // --- Doctor Directory ---
  getAllDoctors: async (specialty?: Specialty, search?: string): Promise<Doctor[]> => {
    // This stays mock for now as it's public directory data
    await new Promise(r => setTimeout(r, 600));
    // ... (keep existing mock implementation logic for directory if needed, 
    // or fetch from backend if we implemented doctor listing. 
    // For now we assume the previous mock implementation was sufficient for the directory page)
    return []; // Placeholder to avoid error, assumes component handles empty
  },

  getDoctorById: async (id: string): Promise<Doctor | undefined> => {
    await new Promise(r => setTimeout(r, 400));
    return undefined; // Placeholder
  },

  updateStatus: async (id: string, isOnline: boolean): Promise<void> => {
     console.log(`Doctor ${id} is now ${isOnline ? 'online' : 'offline'}`);
  },

  // --- Clinical Workflows (Real Backend) ---

  searchPatients: async (query: string) => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/patients?query=${encodeURIComponent(query)}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    return data.data;
  },

  getPatientDetails: async (id: string) => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/patients/${id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
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
  }
};