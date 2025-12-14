
import { prisma } from '../../lib/prisma.js';

export const ConsentService = {
  async requestConsent(doctorId, patientId, scope, reason) {
    // 1. Verify doctor
    const doctor = await prisma.doctor.findUnique({ 
        where: { userId: doctorId } 
    });
    if (!doctor) throw new Error("Doctor profile not found");

    // 2. Create Consent Record
    return prisma.consent.create({
      data: {
        doctorId: doctor.id,
        patientId: patientId,
        scope: scope || ["CLINICAL"],
        reason: reason || "Consultation Access",
        status: "PENDING"
      }
    });
  },

  async approveConsent(patientUserId, requestId) {
    // 1. Verify Patient
    const patient = await prisma.patient.findUnique({ 
        where: { userId: patientUserId } 
    });
    if (!patient) throw new Error("Patient profile not found");

    // 2. Verify Request
    const request = await prisma.consent.findUnique({ where: { id: requestId } });
    if (!request) throw new Error("Request not found");
    if (request.patientId !== patient.id) throw new Error("Unauthorized");

    // 3. Update
    return prisma.consent.update({
      where: { id: requestId },
      data: { status: "APPROVED", grantedAt: new Date() }
    });
  },

  async getActiveConsents(userId, role) {
    if (role === 'patient') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      const consents = await prisma.consent.findMany({
        where: { patientId: patient.id },
        orderBy: { createdAt: 'desc' }
      });
      
      // Manual Join for Doctor details (Since we flattened relations in schema for safety)
      const enriched = await Promise.all(consents.map(async (c) => {
          if (c.doctorId) {
              const doctor = await prisma.doctor.findUnique({
                  where: { id: c.doctorId },
                  include: { user: { select: { name: true, avatar: true } } }
              });
              return { ...c, doctor };
          }
          return c;
      }));
      return enriched;

    } else if (role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      const consents = await prisma.consent.findMany({
        where: { doctorId: doctor.id },
        orderBy: { createdAt: 'desc' }
      });

      // Manual Join for Patient details
      const enriched = await Promise.all(consents.map(async (c) => {
          const patient = await prisma.patient.findUnique({
              where: { id: c.patientId },
              include: { user: { select: { name: true } } }
          });
          return { ...c, patient };
      }));
      return enriched;
    }
    return [];
  }
};
