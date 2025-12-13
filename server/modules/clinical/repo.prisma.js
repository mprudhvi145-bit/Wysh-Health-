import { prisma } from "../../lib/prisma.js";

export const PrismaRepo = {
  async searchPatients(query) {
    return prisma.patient.findMany({
      where: {
        name: { contains: query, mode: "insensitive" }
      },
      take: 20,
    });
  },

  async getPatientChart(patientId) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        appointments: true,
        prescriptions: { include: { items: true } },
        labOrders: true,
        clinicalNotes: { orderBy: { createdAt: 'desc' } },
        documents: true,
      },
    });
    
    if (!patient) return {};

    // Flatten structure to match memory repo expectations if needed
    // The include above actually attaches them to the patient object
    // We separate them to match the { patient, appointments, ... } signature
    const { appointments, prescriptions, labOrders, clinicalNotes, documents, ...patientData } = patient;
    
    return {
      patient: patientData,
      appointments,
      prescriptions,
      labs: labOrders, // Mapping 'labOrders' to 'labs' key as used in memory repo
      clinicalNotes,
      documents
    };
  },

  async createPrescription(input, doctorId) {
    return prisma.prescription.create({
      data: {
        patientId: input.patientId,
        doctorId,
        notes: input.notes,
        items: { create: input.items },
      },
      include: { items: true },
    });
  },

  async createLabOrder(input, doctorId) {
    return prisma.labOrder.create({
      data: {
        patientId: input.patientId,
        doctorId,
        tests: input.tests,
        status: "ORDERED",
        priority: input.priority
      },
    });
  },

  async addNote(input, doctorId) {
    return prisma.clinicalNote.create({
      data: {
        patientId: input.patientId,
        doctorId,
        content: input.content,
        shared: input.shared,
      },
    });
  },

  async startAppointment(appointmentId) {
    return prisma.appointment.update({
      where: { id: appointmentId },
      data: { status: "IN_PROGRESS" },
    });
  },

  async closeAppointment(appointmentId, summary) {
    return prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.update({
        where: { id: appointmentId },
        data: { 
            status: "COMPLETED",
            summary: JSON.stringify(summary)
        },
      });
      
      await tx.clinicalNote.create({
        data: {
          patientId: appt.patientId,
          doctorId: appt.doctorId,
          content: `Visit Closed. Diagnosis: ${summary.diagnosis}. Notes: ${summary.notes}`,
          shared: true,
        },
      });
      
      return appt;
    });
  },

  async getAppointments(filters = {}) {
    const where = {};
    if (filters.doctorId) where.doctorId = filters.doctorId;
    if (filters.patientId) where.patientId = filters.patientId;

    return prisma.appointment.findMany({
      where,
      orderBy: { scheduledAt: 'asc' }
    });
  },

  async createAppointment(input) {
    return prisma.appointment.create({
      data: {
        patientId: input.patientId,
        doctorId: input.doctorId,
        scheduledAt: new Date(`${input.date}T${input.time}:00Z`), // Basic ISO construction
        status: "SCHEDULED",
        type: input.type
      }
    });
  },

  async getAppointmentById(id) {
    return prisma.appointment.findUnique({
      where: { id }
    });
  },

  async checkRelationship(userId, patientId) {
    // For Mock consistency: Map 'usr_doc_1' -> 'doc_1'
    const doctorId = userId === 'usr_doc_1' ? 'doc_1' : userId;
    
    // Check if there is at least one appointment between them
    const count = await prisma.appointment.count({
        where: {
            doctorId: doctorId,
            patientId: patientId
        }
    });
    return count > 0;
  }
};