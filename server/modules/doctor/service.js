
import { prisma } from '../../lib/prisma.js';

export const DoctorService = {
  async getAvailability(userId) {
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new Error("Doctor profile not found");

    return prisma.doctorAvailability.findMany({
      where: { doctorId: doctor.id }
    });
  },

  async updateAvailability(userId, slots) {
    const doctor = await prisma.doctor.findUnique({ where: { userId } });
    if (!doctor) throw new Error("Doctor profile not found");

    // Replace existing
    await prisma.doctorAvailability.deleteMany({
      where: { doctorId: doctor.id }
    });

    // Slots format: { dayOfWeek: 'Monday', startTime: '09:00', endTime: '17:00' }
    if (slots.length > 0) {
      await prisma.doctorAvailability.createMany({
        data: slots.map(s => ({
          doctorId: doctor.id,
          dayOfWeek: s.dayOfWeek,
          startTime: s.startTime,
          endTime: s.endTime
        }))
      });
    }

    return this.getAvailability(userId);
  }
};
