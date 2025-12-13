import { randomUUID } from 'crypto';

// Initial Mock Data
export const mem = {
  // --- PILLAR 1: CLINICAL CATALOGS ---
  catalogs: {
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
  },

  patients: [
    { 
        id: 'p1', 
        userId: 'usr_pat_1', 
        name: 'Alex Doe', 
        dob: '1990-05-20', 
        gender: 'Male', 
        phone: '555-0192', 
        allergies: ['Peanuts'], 
        chronicConditions: ['Arrhythmia'], 
        // --- PILLAR 2: LONGITUDINAL RECORD ---
        problems: [
            { id: 'prob_1', diagnosis: 'Arrhythmia', status: 'Active', onset: '2023-01-15' },
            { id: 'prob_2', diagnosis: 'Seasonal Allergies', status: 'Active', onset: '2020-03-10' }
        ],
        lastVisit: '2024-10-12', 
        status: 'Stable' 
    },
    { id: 'p2', userId: 'usr_pat_2', name: 'Maria Garcia', dob: '1995-08-15', gender: 'Female', phone: '555-0193', allergies: [], chronicConditions: ['Pregnancy'], problems: [{ id: 'prob_3', diagnosis: 'Pregnancy', status: 'Active', onset: '2024-05-01' }], lastVisit: '2024-10-15', status: 'Active' },
    { id: 'p3', userId: 'usr_pat_3', name: 'John Smith', dob: '1978-11-30', gender: 'Male', phone: '555-0194', allergies: ['Penicillin'], chronicConditions: ['Hypertension'], problems: [{ id: 'prob_4', diagnosis: 'Essential Hypertension', status: 'Active', onset: '2019-11-20' }], lastVisit: '2024-10-10', status: 'Critical' }
  ],
  appointments: [
    { 
      id: 'apt_1', 
      patientId: 'p1', 
      doctorId: 'doc_1', 
      scheduledAt: '2024-10-25T10:00:00Z', 
      status: 'SCHEDULED', 
      type: 'video',
      doctorName: 'Dr. Sarah Chen'
    }
  ],
  prescriptions: [
    {
      id: 'rx_1',
      patientId: 'p1', 
      doctorId: 'doc_1', 
      createdAt: '2024-10-12T10:00:00Z', 
      items: [
        { medicine: 'Metoprolol', dosage: '50mg', frequency: 'Twice daily', duration: '30 days' }
      ], 
      notes: 'Take with food' 
    }
  ],
  labs: [
    {
      id: 'lab_1', 
      patientId: 'p1', 
      doctorId: 'doc_1', 
      tests: ['Lipid Panel', 'CBC'], 
      status: 'COMPLETED', 
      createdAt: '2024-10-12T09:30:00Z' 
    }
  ],
  notes: [
    {
      id: 'note_1', 
      patientId: 'p1', 
      doctorId: 'doc_1', 
      content: 'Patient reports mild palpitations. BP 120/80. No new symptoms.', 
      shared: true, 
      createdAt: '2024-10-12T10:30:00Z' 
    }
  ],
  documents: [
    {
      id: 'doc_ai_1',
      patientId: 'p1',
      title: 'Lab Report - Lipid Panel',
      type: 'Lab Report',
      date: '2024-10-12',
      url: '#',
      tags: ['Blood', 'Cardio'],
      extractedData: {
        summary: "The lipid panel indicates elevated LDL cholesterol levels, while HDL and Triglycerides remain within normal ranges. This suggests a need for dietary review.",
        diagnosis: ["Hyperlipidemia"],
        medications: [],
        labs: [
          { test: "LDL Cholesterol", value: "145", unit: "mg/dL", flag: "High" },
          { test: "HDL Cholesterol", value: "55", unit: "mg/dL", flag: "Normal" },
          { test: "Triglycerides", value: "110", unit: "mg/dL", flag: "Normal" }
        ],
        notes: "Patient advised to reduce saturated fats.",
        confidence: 0.94
      }
    }
  ]
};

// Helper to filter out soft-deleted items
const active = (item) => !item.deletedAt;

export const Repo = {
  getCatalogs() {
      return mem.catalogs;
  },

  searchPatients(query) {
    if (!query) return mem.patients;
    return mem.patients.filter(p =>
      p.name?.toLowerCase().includes(query.toLowerCase())
    );
  },

  getPatientChart(patientId) {
    return {
      patient: mem.patients.find(p => p.id === patientId),
      appointments: mem.appointments.filter(a => a.patientId === patientId && active(a)),
      prescriptions: mem.prescriptions.filter(p => p.patientId === patientId && active(p)),
      labs: mem.labs.filter(l => l.patientId === patientId && active(l)),
      clinicalNotes: mem.notes.filter(n => n.patientId === patientId && active(n)), 
      documents: mem.documents.filter(d => d.patientId === patientId && active(d)),
    };
  },

  createPrescription(input, doctorId) {
    const rx = { id: `rx_${randomUUID()}`, doctorId, createdAt: new Date().toISOString(), ...input };
    mem.prescriptions.unshift(rx);
    return rx;
  },

  createLabOrder(input, doctorId) {
    const order = {
      id: `lab_${randomUUID()}`,
      doctorId,
      status: "ORDERED",
      createdAt: new Date().toISOString(),
      ...input,
    };
    mem.labs.unshift(order);
    return order;
  },

  addNote(input, doctorId) {
    const note = { id: `note_${randomUUID()}`, doctorId, createdAt: new Date().toISOString(), ...input };
    mem.notes.unshift(note);
    return note;
  },

  startAppointment(appointmentId) {
    const appt = mem.appointments.find(a => a.id === appointmentId);
    if (!appt) throw new Error("Appointment not found");
    
    // Strict State Transition: SCHEDULED -> IN_PROGRESS only
    if (appt.status !== 'SCHEDULED') {
        throw new Error(`Invalid state transition. Cannot start appointment from status: ${appt.status}`);
    }
    
    appt.status = 'IN_PROGRESS';
    appt.startedAt = new Date().toISOString();
    return appt;
  },

  closeAppointment(appointmentId, summary) {
    const appt = mem.appointments.find(a => a.id === appointmentId);
    if (!appt) throw new Error("Appointment not found");
    
    // Strict State Transition: IN_PROGRESS -> COMPLETED only
    if (appt.status !== 'IN_PROGRESS') {
        throw new Error(`Invalid state transition. Cannot close appointment from status: ${appt.status}. Must be IN_PROGRESS.`);
    }
    
    appt.status = "COMPLETED";
    appt.summary = summary;
    
    const note = {
      id: `note_${randomUUID()}`,
      patientId: appt.patientId,
      doctorId: appt.doctorId, 
      content: `Visit Closed. Diagnosis: ${summary.diagnosis}. Notes: ${summary.notes}`,
      shared: true,
      createdAt: new Date().toISOString()
    };
    mem.notes.unshift(note);

    return appt;
  },
  
  createAppointment(input) {
     const apt = { id: `apt_${randomUUID()}`, status: 'SCHEDULED', ...input };
     mem.appointments.push(apt);
     return apt;
  },
  
  getAppointments(filters = {}) {
     return mem.appointments.filter(a => {
        if (!active(a)) return false; // Filter deleted
        let match = true;
        if (filters.doctorId) match = match && a.doctorId === filters.doctorId;
        if (filters.patientId) match = match && a.patientId === filters.patientId;
        return match;
     });
  },

  getAppointmentById(id) {
    const appt = mem.appointments.find(a => a.id === id);
    if (appt && !active(appt)) return null;
    return appt;
  },

  checkRelationship(userId, patientId) {
    const doctorId = userId === 'usr_doc_1' ? 'doc_1' : userId;
    return mem.appointments.some(a => a.doctorId === doctorId && a.patientId === patientId && active(a));
  },

  getDocumentById(id) {
    const doc = mem.documents.find(d => d.id === id);
    if (doc && !active(doc)) return null;
    return doc;
  },

  // Soft Delete Implementation
  softDelete(entityType, id, userId) {
      let collection;
      switch(entityType) {
          case 'prescription': collection = mem.prescriptions; break;
          case 'note': collection = mem.notes; break;
          case 'document': collection = mem.documents; break;
          default: return false;
      }
      
      const item = collection.find(i => i.id === id);
      if (item) {
          item.deletedAt = new Date().toISOString();
          item.deletedBy = userId;
          return true;
      }
      return false;
  }
};