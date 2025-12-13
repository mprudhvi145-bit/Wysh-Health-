import { randomUUID } from 'crypto';

// Initial Mock Data
export const mem = {
  patients: [
    { id: 'p1', userId: 'usr_pat_1', name: 'Alex Doe', dob: '1990-05-20', gender: 'Male', phone: '555-0192', allergies: ['Peanuts'], chronicConditions: ['Arrhythmia'], lastVisit: '2024-10-12', status: 'Stable' },
    { id: 'p2', userId: 'usr_pat_2', name: 'Maria Garcia', dob: '1995-08-15', gender: 'Female', phone: '555-0193', allergies: [], chronicConditions: ['Pregnancy'], lastVisit: '2024-10-15', status: 'Active' },
    { id: 'p3', userId: 'usr_pat_3', name: 'John Smith', dob: '1978-11-30', gender: 'Male', phone: '555-0194', allergies: ['Penicillin'], chronicConditions: ['Hypertension'], lastVisit: '2024-10-10', status: 'Critical' }
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

export const Repo = {
  searchPatients(query) {
    if (!query) return mem.patients;
    return mem.patients.filter(p =>
      p.name?.toLowerCase().includes(query.toLowerCase())
    );
  },

  getPatientChart(patientId) {
    return {
      patient: mem.patients.find(p => p.id === patientId),
      appointments: mem.appointments.filter(a => a.patientId === patientId),
      prescriptions: mem.prescriptions.filter(p => p.patientId === patientId),
      labs: mem.labs.filter(l => l.patientId === patientId),
      clinicalNotes: mem.notes.filter(n => n.patientId === patientId), 
      documents: mem.documents.filter(d => d.patientId === patientId),
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
    if (appt.status !== 'SCHEDULED') throw new Error("Appointment cannot be started (must be SCHEDULED)");
    
    appt.status = 'IN_PROGRESS';
    appt.startedAt = new Date().toISOString();
    return appt;
  },

  closeAppointment(appointmentId, summary) {
    const appt = mem.appointments.find(a => a.id === appointmentId);
    if (!appt) throw new Error("Appointment not found");
    
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
        let match = true;
        if (filters.doctorId) match = match && a.doctorId === filters.doctorId;
        if (filters.patientId) match = match && a.patientId === filters.patientId;
        return match;
     });
  },

  getAppointmentById(id) {
    return mem.appointments.find(a => a.id === id);
  },

  checkRelationship(userId, patientId) {
    const doctorId = userId === 'usr_doc_1' ? 'doc_1' : userId;
    return mem.appointments.some(a => a.doctorId === doctorId && a.patientId === patientId);
  },

  getDocumentById(id) {
    return mem.documents.find(d => d.id === id);
  }
};