
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
  isHidden?: boolean; // Added for frontend logic
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

export interface ShareResult {
    shareUrl: string;
    expiresAt: string;
    otp: string;
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
  }
];

export const patientService = {
  getRecords: async (patientId: string): Promise<HealthRecord[]> => {
    if (config.dataMode === 'MOCK') {
        // Filter mocking logic is handled in UI display for "Patient", but data persistence is here.
        // For hiding, we check localStorage or the object itself if persisting in memory.
        const hiddenIds = JSON.parse(localStorage.getItem('hidden_records') || '[]');
        return MOCK_RECORDS.map(r => ({
            ...r,
            isHidden: hiddenIds.includes(r.id)
        }));
    }
    
    try {
        const records = await api.get<any[]>('/patient/records');
        return records.map(r => ({
            id: r.id,
            patientId: r.patientId,
            type: r.type,
            title: r.type, // Fallback if no title stored
            date: new Date(r.createdAt).toISOString().split('T')[0],
            url: r.fileUrl,
            tags: [r.type],
            summary: r.extracted ? 'Analysis Available' : undefined,
            isHidden: r.isHidden
        }));
    } catch (e) {
        console.error("API Error", e);
        return MOCK_RECORDS;
    }
  },

  uploadRecord: async (record: any): Promise<HealthRecord> => {
    if (config.dataMode === 'MOCK') {
        const newRecord = { ...record, id: 'rec_' + Math.random().toString(36).substr(2, 9) };
        MOCK_RECORDS.unshift(newRecord);
        return newRecord;
    }

    const formData = new FormData();
    if (record.fileObj) {
        formData.append('file', record.fileObj);
    }
    formData.append('type', record.type);
    formData.append('date', record.date);

    const token = authService.getToken();
    const response = await fetch(`${getBackendUrl()}/patient/records`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    
    if (!response.ok) throw new Error("Upload failed");
    const json = await response.json();
    return json.data;
  },

  hideRecord: async (id: string): Promise<void> => {
      if (config.dataMode === 'MOCK') {
          const hiddenIds = JSON.parse(localStorage.getItem('hidden_records') || '[]');
          if (!hiddenIds.includes(id)) {
              hiddenIds.push(id);
              localStorage.setItem('hidden_records', JSON.stringify(hiddenIds));
          }
          return;
      }
      await api.patch(`/patient/records/${id}/hide`, {});
  },

  shareRecord: async (id: string): Promise<ShareResult> => {
      if (config.dataMode === 'MOCK') {
          return {
              shareUrl: `https://wysh.care/shared/${id}`,
              expiresAt: new Date(Date.now() + 3600000).toISOString(),
              otp: '4921'
          };
      }
      return api.post(`/patient/records/${id}/share`, {});
  },

  extractDocumentData: async (file: File, documentType: string): Promise<ExtractedMedicalData> => {
    try {
      const token = authService.getToken();
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', documentType);

      const response = await fetch(`${getBackendUrl()}/ai/document-extract`, {
        method: 'POST',
        headers: { 'Authorization': token ? `Bearer ${token}` : '' },
        body: formData
      });

      if (!response.ok) throw new Error('Failed to extract data');
      const result = await response.json();
      return result.data;
    } catch (e) {
      return {
        summary: "Mock AI Summary (Backend Unavailable)",
        diagnosis: ["Analysis Pending"],
        medications: [],
        labs: [],
        notes: "Could not connect to AI service.",
        confidence: 0
      };
    }
  },
  
  getPrescriptions: async (patientId: string) => { return []; },
  addPrescription: async (rx: any) => { return rx; },
  searchPatients: async (q: string) => { return []; }
};
