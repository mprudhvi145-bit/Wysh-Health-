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

  // Updated to accept userRole context
  async getPatientChart(patientId, userRole = 'doctor') {
    const data = await Repo.getPatientChart(patientId);
    return serializeChart(data, userRole);
  },

  async createPrescription(dto, doctorId) {
    return await Repo.createPrescription(dto, doctorId);
  },

  async createLabOrder(dto, doctorId) {
    return await Repo.createLabOrder(dto, doctorId);
  },

  async addNote(dto, doctorId) {
    return await Repo.addNote(dto, doctorId);
  },

  async startAppointment(appointmentId) {
    return await Repo.startAppointment(appointmentId);
  },

  async closeAppointment(appointmentId, dto) {
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
      return await Repo.createAppointment(dto);
  },

  async getPrescriptionsForPatient(userId) {
    const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
    const chart = await Repo.getPatientChart(patientId);
    // Explicit serialization for patient view
    return serializeChart(chart, 'patient').prescriptions || [];
  },

  async getLabsForPatient(userId) {
    const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
    const chart = await Repo.getPatientChart(patientId);
    return serializeChart(chart, 'patient').labs || [];
  },

  async getAppointmentById(id) {
    return await Repo.getAppointmentById(id);
  }
};