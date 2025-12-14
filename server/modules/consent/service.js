
import { prisma } from '../../lib/prisma.js';
import { CryptoLib } from '../../lib/crypto.js';
import { randomUUID } from 'crypto';

export const ConsentService = {
  async requestConsent(doctorId, patientId, scope, reason) {
    const doctor = await prisma.doctor.findUnique({ where: { userId: doctorId } });
    if (!doctor) throw new Error("Doctor profile not found");

    return prisma.consent.create({
      data: {
        doctorId: doctor.id,
        patientId: patientId,
        dataScope: Array.isArray(scope) ? scope.join(',') : "CLINICAL",
        purpose: reason || "CAREMGT",
        status: "PENDING"
      }
    });
  },

  async approveConsent(patientUserId, requestId) {
    const patient = await prisma.patient.findUnique({ where: { userId: patientUserId } });
    if (!patient) throw new Error("Patient profile not found");

    const request = await prisma.consent.findUnique({ where: { id: requestId } });
    if (!request) throw new Error("Request not found");
    if (request.patientId !== patient.id) throw new Error("Unauthorized");

    // 1. Generate Consent Artefact JSON (Simulating NDHM Schema)
    const now = new Date();
    const expiry = new Date(now);
    expiry.setFullYear(expiry.getFullYear() + 1);

    const artefact = {
        ver: "1.0",
        timestamp: now.toISOString(),
        consentDetail: {
            consentId: randomUUID(),
            createdAt: now.toISOString(),
            patient: { id: patient.wyshId }, // Using WyshID as proxy for ABHA
            purpose: { code: request.purpose },
            hiTypes: request.dataScope.split(','),
            permission: {
                accessMode: "VIEW",
                dateRange: {
                    from: now.toISOString(),
                    to: expiry.toISOString()
                },
                dataEraseAt: expiry.toISOString(),
            },
            requester: {
                name: "Wysh Care Provider", // In real app, fetch doctor/hospital name
                id: request.doctorId
            }
        }
    };

    // 2. Sign Artefact
    const signature = CryptoLib.signArtefact(artefact);

    // 3. Update Record
    return prisma.consent.update({
      where: { id: requestId },
      data: { 
          status: "GRANTED", 
          grantedAt: now,
          validFrom: now,
          validTo: expiry,
          artefactData: JSON.stringify(artefact),
          signature: signature,
          consentId: artefact.consentDetail.consentId
      }
    });
  },

  async getActiveConsents(userId, role) {
    if (role === 'patient') {
      const patient = await prisma.patient.findUnique({ where: { userId } });
      const consents = await prisma.consent.findMany({
        where: { patientId: patient.id },
        orderBy: { createdAt: 'desc' },
        include: {
            // Include minimal doctor details if needed, manually or via relation if added
        }
      });
      // Flatten manually if needed or return direct
      return consents;
    } else if (role === 'doctor') {
      const doctor = await prisma.doctor.findUnique({ where: { userId } });
      return prisma.consent.findMany({
        where: { doctorId: doctor.id },
        orderBy: { createdAt: 'desc' }
      });
    }
    return [];
  }
};
