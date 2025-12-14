
import { prisma } from '../../lib/prisma.js';
import { CryptoLib } from '../../lib/crypto.js';
import { randomUUID } from 'crypto';
import { CacheService } from '../../lib/cache.js';
import { EventBus, EVENTS } from '../../lib/events.js';

export const PatientService = {
  async getProfile(userId) {
    // 1. Check Cache
    const cacheKey = `patient:profile:${userId}`;
    const cached = await CacheService.get(cacheKey);
    if (cached) return cached;

    // 2. Database Fetch
    const patient = await prisma.patient.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, email: true, phone: true, avatar: true } },
        emergencyProfile: true,
        encounters: {
            take: 1,
            orderBy: { startedAt: 'desc' },
            include: { observations: true }
        }
      }
    });

    if (patient && patient.emergencyProfile && patient.emergencyProfile.instructions) {
        // Decrypt on read
        patient.emergencyProfile.instructions = CryptoLib.decrypt(patient.emergencyProfile.instructions);
    }

    // 3. Set Cache (Short TTL for Profile)
    await CacheService.set(cacheKey, patient, 60); // 1 minute

    return patient;
  },

  async getRecords(userId) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new Error("Patient not found");

    return prisma.document.findMany({
      where: {
        patientId: patient.id,
        isHidden: false
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async uploadRecord(userId, file, type, date) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    if (!patient) throw new Error("Patient not found");

    // In prod, encrypt the URL if it contains sensitive tokens, or encrypt file content
    const mockUrl = `https://storage.wysh.care/patients/${patient.id}/${randomUUID()}.pdf`;

    const doc = await prisma.document.create({
      data: {
        patientId: patient.id,
        type: type,
        fileUrl: mockUrl,
        uploadedBy: "PATIENT",
        createdAt: new Date(date)
      }
    });

    // 4. Emit Event for Async Processing (AI Ingestion)
    EventBus.publish(EVENTS.DOCUMENT_UPLOADED, { 
        documentId: doc.id, 
        userId: userId,
        patientId: patient.id
    });

    return doc;
  },

  async hideRecord(userId, documentId) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    const doc = await prisma.document.findFirst({
        where: { id: documentId, patientId: patient.id }
    });
    if (!doc) throw new Error("Document not found or access denied");

    return prisma.document.update({
      where: { id: documentId },
      data: { isHidden: true }
    });
  },

  async generateShareLink(userId, documentId, durationMinutes = 60) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    const doc = await prisma.document.findFirst({ where: { id: documentId, patientId: patient.id } });
    
    if (!doc) throw new Error("Document not found");

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + durationMinutes * 60000);

    return {
        shareUrl: `${process.env.CLIENT_URL}/shared/view/${documentId}?token=${token}`,
        expiresAt,
        otp: Math.floor(1000 + Math.random() * 9000).toString()
    };
  },

  async updateEmergencyProfile(userId, data) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    
    // Encrypt sensitive instructions
    const encryptedInstructions = data.instructions ? CryptoLib.encrypt(data.instructions) : null;

    const updated = await prisma.emergencyProfile.upsert({
        where: { patientId: patient.id },
        create: {
            patientId: patient.id,
            primaryContact: data.primaryContact,
            secondaryContact: data.secondaryContact,
            instructions: encryptedInstructions
        },
        update: {
            primaryContact: data.primaryContact,
            secondaryContact: data.secondaryContact,
            instructions: encryptedInstructions
        }
    });

    // Invalidate Cache
    await CacheService.del(`patient:profile:${userId}`);
    // Also invalidate public emergency cache
    await CacheService.del(`emergency:${patient.wyshId}`);

    return updated;
  }
};
