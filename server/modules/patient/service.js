
import { prisma } from '../../lib/prisma.js';
import { randomUUID } from 'crypto';

export const PatientService = {
  async getProfile(userId) {
    return prisma.patient.findUnique({
      where: { userId },
      include: {
        user: { select: { name: true, email: true, phone: true, avatar: true } },
        emergencyProfile: true,
        // Get latest vitals from observations
        encounters: {
            take: 1,
            orderBy: { startedAt: 'desc' },
            include: {
                observations: true
            }
        }
      }
    });
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

    // In a real app, upload to S3/GCS here. 
    // We simulate by storing a fake URL or Data URI if small.
    const mockUrl = `https://storage.wysh.care/patients/${patient.id}/${randomUUID()}.pdf`;

    return prisma.document.create({
      data: {
        patientId: patient.id,
        type: type,
        fileUrl: mockUrl,
        uploadedBy: "PATIENT",
        createdAt: new Date(date)
      }
    });
  },

  async hideRecord(userId, documentId) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    
    // Ensure ownership
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

    // Create a temporary access token (mock logic)
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + durationMinutes * 60000);

    // In a real system, store this token in a "ShareLink" table.
    // For now, we return a signed URL structure.
    return {
        shareUrl: `${process.env.CLIENT_URL}/shared/view/${documentId}?token=${token}`,
        expiresAt,
        otp: Math.floor(1000 + Math.random() * 9000).toString() // 4-digit OTP
    };
  },

  async updateEmergencyProfile(userId, data) {
    const patient = await prisma.patient.findUnique({ where: { userId } });
    return prisma.emergencyProfile.upsert({
        where: { patientId: patient.id },
        create: {
            patientId: patient.id,
            primaryContact: data.primaryContact,
            secondaryContact: data.secondaryContact,
            instructions: data.instructions
        },
        update: {
            primaryContact: data.primaryContact,
            secondaryContact: data.secondaryContact,
            instructions: data.instructions
        }
    });
  }
};
