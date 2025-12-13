import { prisma } from "../../lib/prisma.js";

// Global filter helper for Soft Deletes in inclusions
const notDeleted = { where: { deletedAt: null } };

export const PrismaRepo = {
  async searchPatients(query) {
    return prisma.patient.findMany({
      where: {
        // Search by name on the related User model since Patient table is normalized
        user: {
            name: { contains: query, mode: "insensitive" }
        }
      },
      include: {
          user: true // Include user details
      },
      take: 20,
    }).then(patients => patients.map(p => ({ ...p, name: p.user.name, email: p.user.email })));
  },

  async getPatientChart(patientId) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        encounters: notDeleted, // Renamed from appointments
        prescriptions: { 
            where: { deletedAt: null },
            include: { items: true }
        },
        labOrders: notDeleted,
        notes: { // Renamed from clinicalNotes in schema relations usually, but let's check schema. Relation is `notes` in Patient model.
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' } 
        },
        documents: notDeleted,
      },
    });
    
    if (!patient) return {};

    const { encounters, prescriptions, labOrders, notes, documents, user, ...patientData } = patient;
    
    // Merge user data into patient for frontend compatibility
    const patientProfile = {
        ...patientData,
        name: user.name,
        email: user.email,
        abha: user.abhaId ? { id: user.abhaId, address: user.abhaAddress, status: user.abhaLinked ? 'LINKED' : 'PENDING' } : null
    };

    return {
      patient: patientProfile,
      appointments: encounters, // Map back to appointments for UI compatibility
      prescriptions,
      labs: labOrders,
      clinicalNotes: notes,
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
        tests: input.tests, // Schema expects String[], Ensure input.tests is array
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
        const appt = await tx.encounter.findUnique({ where: { id: appointmentId } });
        if (!appt) throw new Error("Appointment not found");
        
        // 2. Enforce Strict Transition
        if (appt.status !== 'SCHEDULED') {
            throw new Error("Invalid State: Can only start SCHEDULED appointments.");
        }

        // 3. Update
        return tx.encounter.update({
            where: { id: appointmentId },
            data: { status: "IN_PROGRESS" },
        });
    });
  },

  async closeAppointment(appointmentId, summary) {
    return prisma.$transaction(async (tx) => {
      // 1. Fetch & Verify State
      const current = await tx.encounter.findUnique({ where: { id: appointmentId }});
      if (!current) throw new Error("Appointment not found");
      
      if (current.status !== 'IN_PROGRESS') {
          throw new Error("Invalid State: Can only close IN_PROGRESS appointments.");
      }

      // 2. Update Encounter
      const appt = await tx.encounter.update({
        where: { id: appointmentId },
        data: { 
            status: "COMPLETED",
            // Note: Schema doesn't have summary field on Encounter, usually stored in Note.
            // But we will create a summary note.
        },
      });
      
      // 3. Create Summary Note (Atomically)
      await tx.clinicalNote.create({
        data: {
          patientId: appt.patientId,
          doctorId: appt.doctorId,
          encounterId: appt.id, // Link to encounter
          content: `Visit Closed. Diagnosis: ${summary.diagnosis}. Notes: ${summary.notes}`,
          shared: true,
        },
      });
      
      return appt;
    });
  },

  async getAppointments(filters = {}) {
    const where = { deletedAt: null };
    if (filters.doctorId) where.doctorId = filters.doctorId;
    if (filters.patientId) where.patientId = filters.patientId;

    // Use Encounter model
    return prisma.encounter.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
          doctor: { include: { user: true } },
          patient: { include: { user: true } }
      }
    }).then(encounters => encounters.map(e => ({
        ...e,
        // Map fields for frontend compatibility
        doctorName: e.doctor.user.name,
        date: e.scheduledAt.toISOString()
    })));
  },

  async createAppointment(input) {
    return prisma.encounter.create({
      data: {
        patientId: input.patientId,
        doctorId: input.doctorId,
        scheduledAt: new Date(`${input.date}T${input.time}:00Z`),
        status: "SCHEDULED",
        type: input.type || 'video'
      }
    });
  },

  async getAppointmentById(id) {
    const e = await prisma.encounter.findFirst({
      where: { id, deletedAt: null },
      include: { doctor: { include: { user: true } } }
    });
    
    if (!e) return null;
    
    return {
        ...e,
        doctorName: e.doctor.user.name,
        date: e.scheduledAt.toISOString()
    };
  },

  async checkRelationship(userId, patientId) {
    const doctorId = userId === 'usr_doc_1' ? 'doc_1' : userId;
    const count = await prisma.encounter.count({
        where: {
            doctorId: doctorId,
            patientId: patientId,
            deletedAt: null
        }
    });
    return count > 0;
  },

  async getDocumentById(id) {
    return prisma.medicalDocument.findFirst({
      where: { id, deletedAt: null },
      include: { aiData: true }
    });
  },

  // ABDM Helpers for Prisma Mode
  async linkAbha(userId, abhaData) {
      return prisma.user.update({
          where: { id: userId },
          data: {
              abhaId: abhaData.id,
              abhaAddress: abhaData.address,
              abhaLinked: true,
              abhaLinkedAt: new Date()
          }
      });
  },

  async createConsent(patientId, data) {
      // Find user for patient
      const patient = await prisma.patient.findUnique({ where: { id: patientId } });
      if(!patient) throw new Error("Patient not found");

      return prisma.abdmConsent.create({
          data: {
              patientUserId: patient.userId,
              consentId: data.consentId || `cons_${Math.random()}`,
              purpose: data.purpose,
              dataScope: Array.isArray(data.dataTypes) ? data.dataTypes.join(',') : 'ALL',
              hipName: data.hipName,
              status: 'GRANTED'
          }
      });
  },

  // Generic Soft Delete
  async softDelete(model, id, userId) {
      // Map frontend model names to Prisma model names
      const modelMap = {
          'prescription': 'prescription',
          'note': 'clinicalNote',
          'document': 'medicalDocument'
      };
      
      const prismaModel = modelMap[model] || model;
      
      if (!prisma[prismaModel]) throw new Error("Invalid model for deletion");
      
      return prisma[prismaModel].update({
          where: { id },
          data: {
              deletedAt: new Date(),
          }
      });
  }
};