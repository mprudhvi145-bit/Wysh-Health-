
import { prisma } from "../../lib/prisma.js";

const notDeleted = { where: { deletedAt: null } };

export const PrismaRepo = {
  async searchPatients(query) {
    return prisma.patient.findMany({
      where: {
        user: {
            name: { contains: query, mode: "insensitive" }
        }
      },
      include: { user: true },
      take: 20,
    }).then(patients => patients.map(p => ({ 
        ...p, 
        name: p.user.name, 
        email: p.user.email 
    })));
  },

  async getPatientChart(patientId) {
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        encounters: notDeleted,
        prescriptions: { 
            where: { deletedAt: null },
            include: { items: true }
        },
        labOrders: notDeleted,
        notes: { 
            where: { deletedAt: null },
            orderBy: { createdAt: 'desc' } 
        },
        documents: notDeleted,
        problems: true,
        allergies: true,
        vitals: { orderBy: { recordedAt: 'desc' }, take: 10 },
        consents: true,
        externalRecords: true
      },
    });
    
    if (!patient) return {};

    const { encounters, prescriptions, labOrders, notes, documents, user, problems, allergies, vitals, consents, externalRecords, ...patientData } = patient;
    
    const patientProfile = {
        ...patientData,
        name: user.name,
        email: user.email,
        abha: user.abhaId ? { id: user.abhaId, address: user.abhaAddress, status: user.abhaLinked ? 'LINKED' : 'PENDING' } : null,
        problems,
        allergies: allergies.map(a => a.allergen),
        chronicConditions: problems.filter(p => p.status === 'Active').map(p => p.diagnosis)
    };

    return {
      patient: patientProfile,
      appointments: encounters.map(e => ({
          ...e,
          date: e.scheduledAt.toISOString().split('T')[0],
          time: e.scheduledAt.toISOString().split('T')[1].substring(0,5),
          doctorName: "Dr. Assigned"
      })), 
      prescriptions,
      labOrders,
      clinicalNotes: notes,
      documents,
      consents,
      externalRecords
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
        // SOAP Fields
        subjective: input.subjective,
        objective: input.objective,
        assessment: input.assessment,
        plan: input.plan,
        shared: input.shared,
      },
    });
  },

  async startAppointment(appointmentId) {
    return prisma.$transaction(async (tx) => {
        const appt = await tx.encounter.findUnique({ where: { id: appointmentId } });
        if (!appt) throw new Error("Appointment not found");
        if (appt.status !== 'SCHEDULED') {
            throw new Error("Invalid State: Can only start SCHEDULED appointments.");
        }
        return tx.encounter.update({
            where: { id: appointmentId },
            data: { status: "IN_PROGRESS", startedAt: new Date() },
        });
    });
  },

  async closeAppointment(appointmentId, summary) {
    return prisma.$transaction(async (tx) => {
      const current = await tx.encounter.findUnique({ where: { id: appointmentId }});
      if (!current) throw new Error("Appointment not found");
      if (current.status !== 'IN_PROGRESS') {
          throw new Error("Invalid State: Can only close IN_PROGRESS appointments.");
      }

      const appt = await tx.encounter.update({
        where: { id: appointmentId },
        data: { status: "COMPLETED", endedAt: new Date() },
      });
      
      await tx.clinicalNote.create({
        data: {
          patientId: appt.patientId,
          doctorId: appt.doctorId,
          encounterId: appt.id, 
          content: `Visit Closed. Diagnosis: ${summary.diagnosis}. Notes: ${summary.notes}`,
          assessment: summary.diagnosis,
          plan: summary.followUp,
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

    return prisma.encounter.findMany({
      where,
      orderBy: { scheduledAt: 'asc' },
      include: {
          doctor: { include: { user: true } },
          patient: { include: { user: true } }
      }
    }).then(encounters => encounters.map(e => ({
        ...e,
        doctorName: e.doctor.user.name,
        scheduledAt: e.scheduledAt.toISOString()
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
        date: e.scheduledAt.toISOString().split('T')[0],
        time: e.scheduledAt.toISOString().split('T')[1].substring(0,5)
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
      const patient = await prisma.patient.findUnique({ where: { id: patientId } });
      if(!patient) throw new Error("Patient not found");

      return prisma.abdmConsent.create({
          data: {
              patientUserId: patient.userId,
              patientId: patient.id,
              consentId: data.consentId || `cons_${Math.random()}`,
              purpose: data.purpose,
              dataScope: Array.isArray(data.dataTypes) ? data.dataTypes.join(',') : 'ALL',
              hipName: data.hipName,
              status: 'GRANTED',
              dateGranted: new Date(),
              validFrom: data.validFrom ? new Date(data.validFrom) : new Date(),
              validTo: data.validTo ? new Date(data.validTo) : null
          }
      });
  },

  async softDelete(model, id, userId) {
      const modelMap = {
          'prescription': 'prescription',
          'note': 'clinicalNote',
          'document': 'medicalDocument'
      };
      const prismaModel = modelMap[model] || model;
      if (!prisma[prismaModel]) throw new Error("Invalid model for deletion");
      
      return prisma[prismaModel].update({
          where: { id },
          data: { deletedAt: new Date() }
      });
  }
};
