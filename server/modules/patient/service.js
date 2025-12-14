
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
    // We navigate from User -> Patient via the 'patient' relation
    const userWithPatient = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: {
            include: {
                emergencyProfile: true,
                encounters: {
                    take: 1,
                    orderBy: { startedAt: 'desc' },
                    where: { deletedAt: null }
                },
                allergies: true,
                conditions: { where: { status: 'Active' } }
            }
        }
      }
    });

    if (!userWithPatient || !userWithPatient.patient) {
        throw new Error("Patient profile not found");
    }

    const patient = userWithPatient.patient;

    // Decrypt instructions if present
    if (patient.emergencyProfile && patient.emergencyProfile.instructions) {
        patient.emergencyProfile.instructions = CryptoLib.decrypt(patient.emergencyProfile.instructions);
    }

    // 3. Set Cache (Short TTL)
    await CacheService.set(cacheKey, patient, 60);

    return patient;
  },

  async getRecords(userId) {
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { patient: true }
    });
    
    if (!user?.patient) throw new Error("Patient context missing");

    return prisma.document.findMany({
      where: {
        patientId: user.patient.id,
        isHidden: false,
        deletedAt: null
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async uploadRecord(userId, file, type, date) {
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { patient: true }
    });
    
    if (!user?.patient) throw new Error("Patient context missing");

    // In prod: Upload to S3/GCS here and get URL.
    // For local dev, we mock the URL or use a base64 data URI if small.
    // Using a reliable placeholder for demo persistence.
    const mockUrl = `https://storage.wysh.care/patients/${user.patient.id}/${randomUUID()}.pdf`;

    const doc = await prisma.document.create({
      data: {
        patientId: user.patient.id,
        type: type,
        title: file ? file.originalname : type,
        fileUrl: mockUrl,
        uploadedBy: "PATIENT",
        createdAt: new Date(date)
      }
    });

    // Async Event: Trigger AI Analysis
    EventBus.publish(EVENTS.DOCUMENT_UPLOADED, { 
        documentId: doc.id, 
        userId: userId,
        patientId: user.patient.id
    });

    return doc;
  },

  async hideRecord(userId, documentId) {
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { patient: true }
    });

    const doc = await prisma.document.findFirst({
        where: { id: documentId, patientId: user.patient.id }
    });
    
    if (!doc) throw new Error("Document not found or access denied");

    return prisma.document.update({
      where: { id: documentId },
      data: { isHidden: true }
    });
  },

  async generateShareLink(userId, documentId, durationMinutes = 60) {
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { patient: true }
    });

    const doc = await prisma.document.findFirst({ 
        where: { id: documentId, patientId: user.patient.id } 
    });
    
    if (!doc) throw new Error("Document not found");

    const token = randomUUID();
    const expiresAt = new Date(Date.now() + durationMinutes * 60000);

    // In a real implementation, we would store this 'ShareToken' in a new table 
    // to validate it later. For now, we return the payload.
    return {
        shareUrl: `${process.env.CLIENT_URL}/shared/view/${documentId}?token=${token}`,
        expiresAt,
        otp: Math.floor(1000 + Math.random() * 9000).toString()
    };
  },

  async updateEmergencyProfile(userId, data) {
    const user = await prisma.user.findUnique({ 
        where: { id: userId },
        include: { patient: true }
    });

    if (!user?.patient) throw new Error("Patient context missing");
    
    // Encrypt sensitive instructions
    const encryptedInstructions = data.instructions ? CryptoLib.encrypt(data.instructions) : null;

    const updated = await prisma.emergencyProfile.upsert({
        where: { patientId: user.patient.id },
        create: {
            patientId: user.patient.id,
            primaryContact: data.primaryContact,
            primaryRel: data.relationship || 'Emergency Contact',
            secondaryContact: data.secondaryContact,
            instructions: encryptedInstructions
        },
        update: {
            primaryContact: data.primaryContact,
            primaryRel: data.relationship || 'Emergency Contact',
            secondaryContact: data.secondaryContact,
            instructions: encryptedInstructions
        }
    });

    // Invalidate Caches
    await CacheService.del(`patient:profile:${userId}`);
    await CacheService.del(`emergency:${user.patient.wyshId}`);

    return updated;
  }
};
