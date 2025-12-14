
import { prisma } from '../../lib/prisma.js';
import { randomUUID } from "crypto";

const serializeChart = (data, role) => {
  if (role === 'patient') {
    return {
      ...data,
      clinicalNotes: data.clinicalNotes?.filter(n => n.shared) || [],
      soapNotes: [], // Usually SOAP is internal, only summary is shared
    };
  }
  return data;
};

export const ClinicalService = {
  // ... existing methods ...
  async getCatalogs() {
      // Mock catalogs for now or fetch from DB if table exists
      return {
        medications: [
          { id: 'med_1', name: 'Metoprolol', strength: '50mg', form: 'Tablet', isGeneric: true },
          { id: 'med_2', name: 'Amoxicillin', strength: '500mg', form: 'Capsule', isGeneric: true }
        ],
        labTests: [
          { id: 'lab_t1', code: 'CBC', name: 'Complete Blood Count', units: 'n/a' }
        ],
        services: []
      };
  },

  async searchPatients(query) {
    return prisma.patient.findMany({
      where: {
        user: { name: { contains: query, mode: 'insensitive' } }
      },
      include: { user: true }
    }).then(pats => pats.map(p => ({
        id: p.id,
        name: p.user.name,
        age: new Date().getFullYear() - p.dob.getFullYear(),
        lastVisit: 'Unknown', // Calculate from encounters
        bloodType: p.bloodGroup
    })));
  },

  async getPatientChart(patientId, userRole = 'doctor') {
    const data = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
            user: true,
            encounters: { include: { soapNote: true }, orderBy: { scheduledAt: 'desc' } },
            prescriptions: { include: { items: true }, orderBy: { createdAt: 'desc' } },
            labOrders: { orderBy: { createdAt: 'desc' } },
            notes: { orderBy: { createdAt: 'desc' } },
            soapNotes: { orderBy: { createdAt: 'desc' } },
            documents: { orderBy: { createdAt: 'desc' } }
        }
    });
    
    if (!data) return {};
    
    // Rename for frontend compatibility if needed
    const chart = {
        patient: { ...data, name: data.user.name },
        appointments: data.encounters,
        prescriptions: data.prescriptions,
        labOrders: data.labOrders,
        clinicalNotes: data.notes,
        soapNotes: data.soapNotes,
        documents: data.documents
    };

    return serializeChart(chart, userRole);
  },

  async createPrescription(dto, doctorId) {
    const doctor = await prisma.doctor.findUnique({ where: { userId: doctorId } });
    if (!doctor) throw new Error("Doctor not found");

    return prisma.prescription.create({
      data: {
        patientId: dto.patientId,
        doctorId: doctor.id,
        notes: dto.notes,
        // Save both JSON and Relational for query flexibility
        medications: dto.items, 
        items: {
            create: dto.items.map(i => ({
                medicine: i.medicine,
                dosage: i.dosage,
                frequency: i.frequency,
                duration: i.duration
            }))
        }
      }
    });
  },

  async createLabOrder(dto, doctorId) {
    const doctor = await prisma.doctor.findUnique({ where: { userId: doctorId } });
    return prisma.labOrder.create({
      data: {
        patientId: dto.patientId,
        doctorId: doctor.id,
        tests: dto.tests,
        status: "ORDERED",
        priority: dto.priority
      }
    });
  },

  async addNote(dto, userId) {
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    
    // Handle SOAP Note specifically
    if (dto.type === 'SOAP') {
        // Need an encounter ID ideally, but if standalone, we might need a dummy encounter or optional field.
        // For Step 4 compliance, let's assume we link to latest encounter or create separate table.
        // Since schema connects SOAP to Encounter, we need encounterId.
        // If not provided, we fallback to ClinicalNote (legacy) or find latest.
        
        const latestEncounter = await prisma.encounter.findFirst({
            where: { patientId: dto.patientId, doctorId: doctor.id, status: 'IN_PROGRESS' },
            orderBy: { scheduledAt: 'desc' }
        });

        if (latestEncounter) {
            // Parse content "SUBJECTIVE: ... OBJECTIVE: ..." if passed as string, or expect separate fields.
            // Assuming DTO handles separation or we parse.
            // Simple parsing for now if content is unstructured string:
            
            return prisma.sOAPNote.upsert({
                where: { encounterId: latestEncounter.id },
                create: {
                    encounterId: latestEncounter.id,
                    patientId: dto.patientId,
                    doctorId: doctor.id,
                    subjective: dto.subjective || "See content",
                    objective: dto.objective,
                    assessment: dto.assessment,
                    plan: dto.plan
                },
                update: {
                    subjective: dto.subjective,
                    objective: dto.objective,
                    assessment: dto.assessment,
                    plan: dto.plan
                }
            });
        }
    }

    // Default to simple note
    return prisma.clinicalNote.create({
        data: {
            patientId: dto.patientId,
            doctorId: doctor.id,
            content: dto.content,
            shared: dto.shared || false,
            type: dto.type || 'GENERAL'
        }
    });
  },

  async startAppointment(appointmentId) {
    // This now also handles TeleSession creation if type is TELECONSULT
    const appt = await prisma.encounter.findUnique({ where: { id: appointmentId } });
    if (!appt) throw new Error("Appointment not found");

    const updateData = { status: 'IN_PROGRESS', startedAt: new Date() };
    
    if (appt.type === 'TELECONSULT') {
        const joinUrl = `https://meet.jit.si/wysh-${appointmentId}`;
        await prisma.teleSession.create({
            data: {
                encounterId: appt.id,
                joinUrl: joinUrl,
                startedAt: new Date()
            }
        });
        // We don't return the URL here, client fetches via appointment detail
    }

    return prisma.encounter.update({
        where: { id: appointmentId },
        data: updateData
    });
  },

  async closeAppointment(appointmentId, dto) {
    return prisma.encounter.update({
        where: { id: appointmentId },
        data: {
            status: 'COMPLETED',
            endedAt: new Date()
        }
    });
    // Create summary note logic omitted for brevity, handled in addNote if needed
  },
  
  async getAppointments(userRole, userId) {
      if (userRole === 'doctor') {
          const doctor = await prisma.doctor.findUnique({ where: { userId } });
          return prisma.encounter.findMany({
              where: { doctorId: doctor.id, deletedAt: null },
              include: { patient: { include: { user: true } } },
              orderBy: { scheduledAt: 'asc' }
          }).then(evts => evts.map(e => ({
              id: e.id,
              patientId: e.patientId,
              patientName: e.patient.user.name,
              scheduledAt: e.scheduledAt.toISOString(),
              status: e.status,
              type: e.type,
              time: e.scheduledAt.toISOString().split('T')[1].substring(0,5)
          })));
      } else {
          // Patient logic
          return [];
      }
  },

  async createAppointment(dto) {
      // ... same as before
      return prisma.encounter.create({
          data: {
              patientId: dto.patientId,
              doctorId: dto.doctorId,
              status: 'SCHEDULED',
              type: dto.type || 'OPD',
              scheduledAt: new Date(`${dto.date}T${dto.time}:00Z`)
          }
      });
  },

  async getPrescriptionsForPatient(userId) {
      // ...
      return [];
  },

  async getLabsForPatient(userId) {
      // ...
      return [];
  },

  async getAppointmentById(id) {
    const appt = await prisma.encounter.findUnique({
        where: { id },
        include: { 
            doctor: { include: { user: true } },
            teleSession: true 
        }
    });
    if (!appt) return null;
    return {
        ...appt,
        doctorName: appt.doctor.user.name,
        meetingLink: appt.teleSession?.joinUrl,
        date: appt.scheduledAt.toISOString().split('T')[0],
        time: appt.scheduledAt.toISOString().split('T')[1].substring(0,5)
    };
  },

  async getAIInsight(documentId, user) {
      // ...
      return null;
  },

  async getFileAccess(documentId, user) {
      // ...
      return { url: "#" };
  }
};
