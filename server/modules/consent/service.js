
import { prisma } from '../../lib/prisma.js';

export const ConsentService = {
  async requestConsent(doctorId, patientId, scope, reason) {
    // Verify doctor and patient exist
    const doctor = await prisma.doctor.findUnique({ where: { userId: doctorId } });
    if (!doctor) throw new Error("Doctor profile not found");

    return prisma.consentRequest.create({
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
    const patient = await prisma.patient.findUnique({ where: { userId: patientUserId } });
    if (!patient) throw new Error("Patient profile not found");

    const request = await prisma.consentRequest.findUnique({ where: { id: requestId } });
    if (!request) throw new Error("Request not found");
    if (request.patientId !== patient.id) throw new Error("Unauthorized");

    return prisma.consentRequest.update({
      where: { id: requestId },
      data: { status: "APPROVED" }
    });
  },

  async rejectConsent(patientUserId, requestId) {
    const patient = await prisma.patient.findUnique({ where: { userId: patientUserId } });
    if (!patient) throw new Error("Patient profile not found");

    const request = await prisma.consentRequest.findUnique({ where: { id: requestId } });
    if (request.patientId !== patient.id) throw new Error("Unauthorized");

    return prisma.consentRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" }
    });
  },

  async getActiveConsents(userId, role) {
    if (role === 'patient') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      return prisma.consentRequest.findMany({
        where: { patientId: patient.id },
        include: { doctor: { include: { user: true } } },
        orderBy: { createdAt: 'desc' }
      });
    } else if (role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      return prisma.consentRequest.findMany({
        where: { doctorId: doctor.id },
        include: { patient: { include: { user: true } } },
        orderBy: { createdAt: 'desc' }
      });
    }
    return [];
  }
};
