import { Repo } from "./repo.js";

// Helper for serialization/filtering
const serializeChart = (data, role) => {
  if (role === 'patient') {
    return {
      ...data,
      clinicalNotes: data.clinicalNotes?.filter(n => n.shared) || [],
      // Remove sensitive fields if any
      // documents: data.documents.filter(d => !d.internalOnly) 
    };
  }
  return data; // Doctors see everything
};

export const ClinicalService = {
  async searchPatients(query) {
    return await Repo.searchPatients(query || "");
  },

  async getPatientChart(patientId, userRole = 'doctor') {
    const data = await Repo.getPatientChart(patientId);
    return serializeChart(data, userRole);
  },

  async createPrescription(dto, doctorId) {
    // Validation
    if (!dto.patientId) throw new Error("Patient ID is required");
    if (!dto.items || dto.items.length === 0) throw new Error("Prescription must contain at least one medication");
    
    // Item validation
    for (const item of dto.items) {
        if (!item.medicine || !item.dosage) throw new Error("Medication name and dosage are required");
    }

    return await Repo.createPrescription(dto, doctorId);
  },

  async createLabOrder(dto, doctorId) {
    if (!dto.patientId) throw new Error("Patient ID is required");
    if (!dto.tests || dto.tests.length === 0) throw new Error("At least one test must be selected");
    
    return await Repo.createLabOrder(dto, doctorId);
  },

  async addNote(dto, doctorId) {
    if (!dto.content) throw new Error("Note content cannot be empty");
    return await Repo.addNote(dto, doctorId);
  },

  async startAppointment(appointmentId) {
    return await Repo.startAppointment(appointmentId);
  },

  async closeAppointment(appointmentId, dto) {
    if (!dto.diagnosis) throw new Error("Diagnosis is required to close a visit");
    return await Repo.closeAppointment(appointmentId, dto);
  },
  
  async getAppointments(userRole, userId) {
      if (userRole === 'doctor') {
          // Mock doctor mapping for ID stability in demo
          const doctorId = userId === 'usr_doc_1' ? 'doc_1' : userId; 
          return await Repo.getAppointments({ doctorId });
      } else {
          const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
          return await Repo.getAppointments({ patientId });
      }
  },

  async createAppointment(dto) {
      if (!dto.doctorId || !dto.patientId || !dto.date || !dto.time) {
          throw new Error("Missing required appointment fields");
      }
      return await Repo.createAppointment(dto);
  },

  async getPrescriptionsForPatient(userId) {
    const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
    const chart = await Repo.getPatientChart(patientId);
    return serializeChart(chart, 'patient').prescriptions || [];
  },

  async getLabsForPatient(userId) {
    const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
    const chart = await Repo.getPatientChart(patientId);
    return serializeChart(chart, 'patient').labs || [];
  },

  async getAppointmentById(id) {
    return await Repo.getAppointmentById(id);
  },

  // NEW: AI Insight Retrieval with Security Guards
  async getAIInsight(documentId, user) {
    const doc = await Repo.getDocumentById(documentId);
    if (!doc) throw new Error("Document not found");

    // Security Check: Access Control
    if (user.role === 'patient') {
        const patientId = user.id === 'usr_pat_1' ? 'p1' : user.id; // Mock mapping
        if (doc.patientId !== patientId) {
            throw { status: 403, message: "Access Denied: Not your document" };
        }
    } else if (user.role === 'doctor') {
        const hasAccess = await Repo.checkRelationship(user.id, doc.patientId);
        if (!hasAccess) {
             throw { status: 403, message: "Access Denied: Patient not in your care" };
        }
    }

    if (!doc.extractedData) return null;

    // Serialization: Role-Specific Views
    const aiData = doc.extractedData;
    
    if (user.role === 'patient') {
        // Patient Safe View: Summary Only
        return {
            summary: aiData.summary,
            highlights: [
                ...(aiData.diagnosis || []),
                ...(aiData.labs?.filter(l => l.flag !== 'Normal').map(l => `${l.test}: ${l.flag}`) || [])
            ],
            recommendations: ["Please discuss these results with your primary care physician."],
            source: "AI-assisted Analysis",
            generatedAt: new Date().toISOString() // Or doc creation date
        };
    }

    // Doctor View: Full Data + Confidence + Flags
    return {
        ...aiData,
        source: "AI-Clinical Engine (Gemini 2.5)",
        redFlags: aiData.labs?.filter(l => l.flag === 'High' || l.flag === 'Critical') || [],
        rawConfidence: aiData.confidence
    };
  }
};