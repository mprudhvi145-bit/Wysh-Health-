import { prisma } from "../../lib/prisma.js";

// Global filter helper for Soft Deletes in inclusions
const notDeleted = { where: { deletedAt: null } };

export const PrismaRepo = {
  async searchPatients(query) {
    return prisma.patient.findMany({
      where: {
        name: { contains: query, mode: "insensitive" },
        // deletedAt: null // Assuming Patient model has this
      },
      take: 20,
    });
  },

  async getPatientChart(patientId) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        appointments: notDeleted,
        prescriptions: { 
            where: { deletedAt: null },
            include: { items: true } // Items should also be checked if they soft delete independently
        },
        labOrders: notDeleted,
        clinicalNotes: { 
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' } 
        },
        documents: notDeleted,
      },
    });
    
    if (!patient) return {};

    const { appointments, prescriptions, labOrders, clinicalNotes, documents, ...patientData } = patient;
    
    return {
      patient: patientData,
      appointments,
      prescriptions,
      labs: labOrders,
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
    return prisma.$transaction(async (tx) => {
        // 1. Fetch current state
        const appt = await tx.appointment.findUnique({ where: { id: appointmentId } });
        if (!appt) throw new Error("Appointment not found");
        
        // 2. Enforce Strict Transition
        if (appt.status !== 'SCHEDULED') {
            throw new Error("Invalid State: Can only start SCHEDULED appointments.");
        }

        // 3. Update
        return tx.appointment.update({
            where: { id: appointmentId },
            data: { status: "IN_PROGRESS" },
        });
    });
  },

  async closeAppointment(appointmentId, summary) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch & Verify State
      const current = await tx.appointment.findUnique({ where: { id: appointmentId }});
      if (!current) throw new Error("Appointment not found");
      
      if (current.status !== 'IN_PROGRESS') {
          throw new Error("Invalid State: Can only close IN_PROGRESS appointments.");
      }

      // 2. Update Appointment
      const appt = await tx.appointment.update({
        where: { id: appointmentId },
        data: { 
            status: "COMPLETED",
            summary: JSON.stringify(summary)
        },
      });
      
      // 3. Create Summary Note (Atomically)
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
    const where = { deletedAt: null }; // Soft delete filter
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
        scheduledAt: new Date(`${input.date}T${input.time}:00Z`),
        status: "SCHEDULED",
        type: input.type
      }
    });
  },

  async getAppointmentById(id) {
    return prisma.appointment.findFirst({
      where: { id, deletedAt: null }
    });
  },

  async checkRelationship(userId, patientId) {
    const doctorId = userId === 'usr_doc_1' ? 'doc_1' : userId;
    const count = await prisma.appointment.count({
        where: {
            doctorId: doctorId,
            patientId: patientId,
            deletedAt: null
        }
    });
    return count > 0;
  },

  async getDocumentById(id) {
    return prisma.document.findFirst({
      where: { id, deletedAt: null }
    });
  },

  // Generic Soft Delete
  async softDelete(model, id, userId) {
      if (!prisma[model]) throw new Error("Invalid model for deletion");
      
      return prisma[model].update({
          where: { id },
          data: {
              deletedAt: new Date(),
              // deletedBy: userId // Assuming schema has this field
          }
      });
  }
};