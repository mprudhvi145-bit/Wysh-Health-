import { Repo } from "./repo.memory.js";

export const ClinicalService = {
  searchPatients(query) {
    return Repo.searchPatients(query || "");
  },

  getPatientChart(patientId) {
    return Repo.getPatientChart(patientId);
  },

  createPrescription(dto, doctorId) {
    // Business logic: Validate Items could go here
    return Repo.createPrescription(dto, doctorId);
  },

  createLabOrder(dto, doctorId) {
    // Business logic: Check if tests are valid could go here
    return Repo.createLabOrder(dto, doctorId);
  },

  addNote(dto, doctorId) {
    return Repo.addNote(dto, doctorId);
  },

  closeAppointment(appointmentId, dto) {
    return Repo.closeAppointment(appointmentId, dto);
  },
  
  // Additional getters for the shared dashboard views
  getAppointments(userRole, userId) {
      // Logic to map userId to doctorId/patientId is currently handled in the Repo or here.
      // For simplicity in this mock, we assume the userId passed in matches the stored ID format
      // or we check the 'userId' field on the patient/doctor records.
      
      // We'll trust the repo filter for now
      if (userRole === 'doctor') {
          // In a real app we'd look up the doctor ID from the User ID.
          // For this mock, we'll return all appointments or filter if we had the mapping.
          // We will mock filtering by "doc_1" if the user is the mock doctor.
          const doctorId = userId === 'usr_doc_1' ? 'doc_1' : userId; 
          return Repo.getAppointments({ doctorId });
      } else {
          const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
          return Repo.getAppointments({ patientId });
      }
  },

  createAppointment(dto) {
      return Repo.createAppointment(dto);
  },

  getPrescriptionsForPatient(userId) {
    const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
    return Repo.getPatientChart(patientId).prescriptions;
  },

  getLabsForPatient(userId) {
    const patientId = userId === 'usr_pat_1' ? 'p1' : userId;
    return Repo.getPatientChart(patientId).labs;
  },

  getAppointmentById(id) {
    return Repo.getAppointmentById(id);
  }
};