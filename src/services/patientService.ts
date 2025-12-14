
import { config } from '../config';
import { authService } from './authService';
import { api } from './api';

const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  return `${config.apiBaseUrl}`;
};

export interface HealthRecord {
  id: string;
  patientId: string;
  type: 'Lab Report' | 'Prescription' | 'Scan' | 'Vaccination' | 'Discharge Summary';
  title: string;
  date: string;
  url: string;
  summary?: string;
  tags: string[];
  extractedData?: ExtractedMedicalData;
  isExternal?: boolean;
  source?: string;
}

export interface ExtractedMedicalData {
  summary: string;
  diagnosis: string[];
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  labs: {
    test: string;
    value: string;
    unit: string;
    range: string;
    flag: 'High' | 'Low' | 'Normal';
  }[];
  notes: string;
  confidence: number;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName?: string;
  medications?: any[];
  items?: any[]; // Backend name
  date?: string;
  createdAt?: string; // Backend name
  status: 'Active' | 'Completed' | 'ACTIVE';
  notes?: string;
}

export interface PatientProfile {
  id: string;
  name: string;
  age: number;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  lastVisit: string;
}

// Mock fallback for Records
const MOCK_RECORDS: HealthRecord[] = [
  {
    id: 'rec_1',
    patientId: 'p1',
    type: 'Lab Report',
    title: 'Complete Blood Count (CBC)',
    date: '2024-10-10',
    url: '#',
    summary: 'Hemoglobin slightly low (11.5 g/dL). WBC count normal.',
    tags: ['Blood', 'Routine']
  },
  {
    id: 'rec_ext_1',
    patientId: 'p1',
    type: 'Discharge Summary',
    title: 'Viral Fever Treatment',
    date: '2024-09-15',
    url: '#',
    summary: 'Patient treated for mild viral fever. Vitals stable.',
    tags: ['External', 'Apollo'],
    isExternal: true,
    source: 'Apollo Hospital Delhi'
  }
];

export const patientService = {
  getRecords: async (patientId: string): Promise<HealthRecord[]> => {
    // Always return Mock for now as backend file handling is complex to simulate without real server
    return MOCK_RECORDS; 
  },

  extractDocumentData: async (file: File, documentType: string): Promise<ExtractedMedicalData> => {
    const mockExtraction: ExtractedMedicalData = {
        summary: "Mock AI Summary: Patient shows signs of mild infection.",
        diagnosis: ["Viral Fever"],
        medications: [{ name: "Dolo 650", dosage: "650mg", frequency: "TID", duration: "3 days" }],
        labs: [{ test: "WBC", value: "11000", unit: "/mcL", range: "4000-11000", flag: "Normal" }],
        notes: "Advice rest and hydration.",
        confidence: 0.95
    };

    if (config.dataMode === 'MOCK') {
        await new Promise(r => setTimeout(r, 1500));
        return mockExtraction;
    }

    try {
      const token = authService.getToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch(`${getBackendUrl()}/ai/document-extract`, {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to extract data');
      const result = await response.json();
      return result.data;
    } catch (e) {
      console.warn("AI Service unavailable, using mock extraction", e);
      await new Promise(r => setTimeout(r, 1000));
      return mockExtraction;
    }
  },

  uploadRecord: async (record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
    // Store in mock memory for session
    const newRecord = { ...record, id: 'rec_' + Math.random().toString(36).substr(2, 9) };
    MOCK_RECORDS.unshift(newRecord);
    return newRecord;
  },

  getPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    const MOCK_RX: Prescription[] = [{
        id: 'rx_mock_1',
        patientId: 'p1',
        doctorName: 'Dr. Sarah Chen',
        date: '2024-10-12',
        status: 'Active',
        notes: 'Take with food',
        medications: [{ name: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: '30 days' }]
    }];

    if (config.dataMode === 'MOCK') return MOCK_RX;

    try {
      const token = authService.getToken();
      const res = await fetch(`${getBackendUrl()}/clinical/prescriptions/mine`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const json = await res.json();
        return json.data.map((rx: any) => ({
           ...rx,
           date: rx.createdAt ? rx.createdAt.split('T')[0] : rx.date,
           medications: rx.items ? rx.items.map((i: any) => ({
             name: i.medicine,
             dosage: i.dosage,
             frequency: i.frequency,
             duration: i.duration
           })) : []
        }));
      }
      return MOCK_RX;
    } catch(e) {
      console.warn("Backend unavailable, using mock rx", e);
      return MOCK_RX;
    }
  },

  addPrescription: async (rx: Omit<Prescription, 'id'>): Promise<Prescription> => {
    return { ...rx, id: 'mock' } as Prescription; 
  },

  searchPatients: async (query: string): Promise<PatientProfile[]> => {
    return []; 
  }
};
