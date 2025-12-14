
import { prisma } from '../../lib/prisma.js';

export const EmergencyService = {
  async getProfile(wyshId) {
    const patient = await prisma.patient.findUnique({
      where: { wyshId },
      include: {
        user: { select: { name: true, avatar: true } },
        emergencyProfile: true,
        allergies: true,
        conditions: { where: { status: 'Active' } },
        // Only return CRITICAL items
      }
    });

    if (!patient) throw new Error("Patient not found");

    return {
      name: patient.user.name,
      avatar: patient.user.avatar,
      bloodGroup: patient.bloodGroup,
      emergencyContacts: {
        primary: patient.emergencyProfile?.primaryContact,
        relationship: patient.emergencyProfile?.primaryRel,
        secondary: patient.emergencyProfile?.secondaryContact
      },
      medicalAlerts: {
        allergies: patient.allergies.map(a => a.allergen),
        conditions: patient.conditions.map(c => c.diagnosis),
        notes: patient.emergencyProfile?.instructions
      }
    };
  },

  async logEmergencyAccess(wyshId, reqInfo) {
    const patient = await prisma.patient.findUnique({ where: { wyshId } });
    if (patient) {
      await prisma.accessLog.create({
        data: {
          patientId: patient.id,
          actorId: null, // Anonymous / System
          action: "EMERGENCY_ACCESS",
          resource: "Emergency Profile",
          reason: "Critical Emergency Access via QR",
          ipAddress: reqInfo.ip,
          userAgent: reqInfo.userAgent
        }
      });
    }
  }
};
