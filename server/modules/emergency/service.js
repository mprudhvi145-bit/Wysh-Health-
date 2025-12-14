
import { prisma } from '../../lib/prisma.js';
import { CacheService } from '../../lib/cache.js';
import { EventBus, EVENTS } from '../../lib/events.js';

export const EmergencyService = {
  async getProfile(wyshId) {
    // 1. Aggressive Caching for Emergency Read (Critical Path)
    const cacheKey = `emergency:${wyshId}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    const patient = await prisma.patient.findUnique({
      where: { wyshId },
      include: {
        user: { select: { name: true, avatar: true } },
        emergencyProfile: true,
        allergies: true,
        conditions: { where: { status: 'Active' } },
        medications: { where: { status: 'ACTIVE' }, include: { items: true } } // Fetch active prescriptions
      }
    });

    if (!patient) throw new Error("Patient not found");

    // Flatten Medications
    const meds = patient.medications.flatMap(rx => 
        rx.items.map(i => `${i.medicine} ${i.dosage}`)
    );

    const profile = {
      name: patient.user.name,
      avatar: patient.user.avatar,
      bloodGroup: patient.bloodGroup,
      wyshId: patient.wyshId,
      emergencyContacts: {
        primary: patient.emergencyProfile?.primaryContact,
        relationship: patient.emergencyProfile?.primaryRel,
        secondary: patient.emergencyProfile?.secondaryContact
      },
      medicalAlerts: {
        allergies: patient.allergies.map(a => a.allergen),
        conditions: patient.conditions.map(c => c.diagnosis),
        notes: patient.emergencyProfile?.instructions,
        currentMeds: meds
      }
    };

    // Cache for 5 minutes (Emergency data doesn't change often but needs high availability)
    await CacheService.set(cacheKey, profile, 300);

    return profile;
  },

  async logEmergencyAccess(wyshId, reqInfo) {
    // Emit event instead of writing to DB directly in the request path
    EventBus.publish(EVENTS.EMERGENCY_ACCESSED, { 
        wyshId, 
        ip: reqInfo.ip 
    });

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
