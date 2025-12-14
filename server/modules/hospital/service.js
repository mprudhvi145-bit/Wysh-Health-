
import { prisma } from '../../lib/prisma.js';

export const HospitalService = {
  async getMetrics() {
    // Aggregated metrics for the dashboard
    const totalPatients = await prisma.patient.count();
    const todayAppointments = await prisma.encounter.count({
      where: {
        scheduledAt: {
          gte: new Date(new Date().setHours(0,0,0,0)),
          lt: new Date(new Date().setHours(23,59,59,999))
        }
      }
    });
    const activeDoctors = await prisma.doctor.count({
      where: {
        // user: { isActive: true } // Assuming join
      }
    });

    return {
      patients: totalPatients,
      appointmentsToday: todayAppointments,
      activeDoctors: activeDoctors,
      occupancy: '85%' // Mock for now
    };
  },

  async addDoctor(data) {
    // Logic to invite/create doctor
    // For now, simpler creation
    return prisma.doctor.create({
      data: {
        specialty: data.specialty,
        licenseNumber: data.license,
        user: {
          create: {
            name: data.name,
            email: data.email,
            role: 'DOCTOR',
            password: 'temp_password' // Needs hashed in real app
          }
        }
      },
      include: { user: true }
    });
  }
};
