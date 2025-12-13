import { Repo } from "./repo.js";
import { randomUUID } from "crypto";

const serializeChart = (data, role) => {
  if (role === 'patient') {
    return {
      ...data,
      clinicalNotes: data.clinicalNotes?.filter(n => n.shared) || [],
    };
  }
  return data;
};

export const ClinicalService = {
  async getCatalogs() {
      return await Repo.getCatalogs();
  },

  async searchPatients(query) {
    return await Repo.searchPatients(query || "");
  },

  async getPatientChart(patientId, userRole = 'doctor') {
    const data = await Repo.getPatientChart(patientId);
    return serializeChart(data, userRole);
  },

  async createPrescription(dto, doctorId) {
    if (!dto.patientId) throw new Error("Patient ID is required");
    if (!Array.isArray(dto.items) || dto.items.length === 0) throw new Error("Prescription must contain at least one medication");
    
    dto.items.forEach((item, index) => {
        if (!item.medicine || typeof item.medicine !== 'string') throw new Error(`Invalid medicine at index ${index}`);
        if (!item.dosage || typeof item.dosage !== 'string') throw new Error(`Invalid dosage at index ${index}`);
    });

    return await Repo.createPrescription(dto, doctorId);
  },

  async createLabOrder(dto, doctorId) {
    if (!dto.patientId) throw new Error("Patient ID is required");
    if (!Array.isArray(dto.tests) || dto.tests.length === 0) throw new Error("At least one test must be selected");
    return await Repo.createLabOrder(dto, doctorId);
  },

  async addNote(dto, doctorId) {
    const hasContent = dto.content && typeof dto.content === 'string' && dto.content.trim().length > 0;
    const hasSoap = dto.subjective || dto.assessment;
    
    if (!hasContent && !hasSoap) {
        throw new Error("Note must contain content or SOAP details");
    }
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

  async getAIInsight(documentId, user) {
    const doc = await Repo.getDocumentById(documentId);
    if (!doc) throw new Error("Document not found");

    if (user.role === 'patient') {
        const patientId = user.id === 'usr_pat_1' ? 'p1' : user.id; 
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

    const aiData = doc.extractedData;
    
    if (user.role === 'patient') {
        return {
            summary: aiData.summary,
            highlights: [
                ...(aiData.diagnosis || []),
                ...(aiData.labs?.filter(l => l.flag !== 'Normal').map(l => `${l.test}: ${l.flag}`) || [])
            ],
            recommendations: ["Please discuss these results with your primary care physician."],
            source: "AI-assisted Analysis",
            generatedAt: new Date().toISOString()
        };
    }

    return {
        ...aiData,
        source: "AI-Clinical Engine (Gemini 2.5)",
        redFlags: aiData.labs?.filter(l => l.flag === 'High' || l.flag === 'Critical') || [],
        rawConfidence: aiData.confidence
    };
  },

  async getFileAccess(documentId, user) {
      const doc = await Repo.getDocumentById(documentId);
      if (!doc) throw { status: 404, message: "Document not found" };

      if (user.role === 'patient') {
         const patientId = user.id === 'usr_pat_1' ? 'p1' : user.id;
         if (doc.patientId !== patientId) throw { status: 403, message: "Unauthorized" };
      } else if (user.role === 'doctor') {
         const hasAccess = await Repo.checkRelationship(user.id, doc.patientId);
         if (!hasAccess) throw { status: 403, message: "Unauthorized" };
      }

      const token = randomUUID();
      const expiresAt = Date.now() + (10 * 60 * 1000); 
      
      return {
          url: doc.url, 
          token: token,
          expiresAt: new Date(expiresAt).toISOString()
      };
  }
};