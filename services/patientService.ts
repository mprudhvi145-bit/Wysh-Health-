
// Mock Data Service for Patient Records

export interface HealthRecord {
  id: string;
  patientId: string;
  type: 'Lab Report' | 'Prescription' | 'Scan' | 'Vaccination';
  title: string;
  date: string;
  url: string; // Mock URL or base64
  summary?: string;
  tags: string[];
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
  }[];
  date: string;
  status: 'Active' | 'Completed';
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
    id: 'rec_2',
    patientId: 'p1',
    type: 'Scan',
    title: 'Chest X-Ray',
    date: '2024-09-15',
    url: '#',
    summary: 'Clear fields. No signs of consolidation or pleural effusion.',
    tags: ['Radiology', 'Lungs']
  }
];

const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx_1',
    patientId: 'p1',
    doctorName: 'Dr. Sarah Chen',
    medications: [
      { name: 'Atorvastatin', dosage: '20mg', frequency: 'Once daily at night', duration: '30 days' },
      { name: 'Aspirin', dosage: '81mg', frequency: 'Once daily', duration: 'Indefinite' }
    ],
    date: '2024-10-12',
    status: 'Active',
    notes: 'Monitor for muscle pain.'
  }
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const patientService = {
  getRecords: async (patientId: string): Promise<HealthRecord[]> => {
    await delay(500);
    return MOCK_RECORDS; // In real app, filter by ID
  },

  uploadRecord: async (record: Omit<HealthRecord, 'id'>): Promise<HealthRecord> => {
    await delay(1000);
    const newRecord = { ...record, id: 'rec_' + Math.random().toString(36).substr(2, 9) };
    MOCK_RECORDS.unshift(newRecord);
    return newRecord;
  },

  getPrescriptions: async (patientId: string): Promise<Prescription[]> => {
    await delay(400);
    return MOCK_PRESCRIPTIONS;
  },

  addPrescription: async (rx: Omit<Prescription, 'id'>): Promise<Prescription> => {
    await delay(800);
    const newRx = { ...rx, id: 'rx_' + Math.random().toString(36).substr(2, 9) };
    MOCK_PRESCRIPTIONS.unshift(newRx);
    return newRx;
  },

  searchPatients: async (query: string): Promise<PatientProfile[]> => {
    await delay(300);
    // Mock search
    return [
      { id: 'p1', name: 'Alex Doe', age: 34, bloodType: 'O+', allergies: ['Peanuts'], chronicConditions: ['Arrhythmia'], lastVisit: '2024-10-12' },
      { id: 'p2', name: 'Maria Garcia', age: 29, bloodType: 'A-', allergies: [], chronicConditions: ['Pregnancy'], lastVisit: '2024-10-15' },
      { id: 'p3', name: 'John Smith', age: 45, bloodType: 'B+', allergies: ['Penicillin'], chronicConditions: ['Hypertension'], lastVisit: '2024-10-10' },
    ].filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
  }
};
