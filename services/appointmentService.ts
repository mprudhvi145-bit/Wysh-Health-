
import { Appointment, TimeSlot } from '../types/appointment';

const STORAGE_KEY = 'wysh_appointments';

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const appointmentService = {
  // Generate mock slots for the next 7 days
  getAvailableSlots: async (doctorId: string, date: string): Promise<TimeSlot[]> => {
    await delay(500);
    
    // Deterministic pseudo-random based on date/doctor
    const slots: TimeSlot[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let h = startHour; h < endHour; h++) {
      // 30 min intervals
      const t1 = `${h.toString().padStart(2, '0')}:00`;
      const t2 = `${h.toString().padStart(2, '0')}:30`;
      
      // Random availability logic
      slots.push({ time: t1, available: Math.random() > 0.3 });
      slots.push({ time: t2, available: Math.random() > 0.3 });
    }

    return slots;
  },

  bookAppointment: async (appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
    await delay(1000);

    const newAppointment: Appointment = {
      ...appointment,
      id: 'apt_' + Math.random().toString(36).substr(2, 9),
      status: 'confirmed',
      meetingLink: appointment.type === 'video' ? `https://wysh.care/meet/${Math.random().toString(36).substr(2, 6)}` : undefined
    };

    const existing = appointmentService.getAllAppointmentsSync();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, newAppointment]));

    return newAppointment;
  },

  getAppointmentsForUser: async (userId: string, role: 'patient' | 'doctor' | 'admin'): Promise<Appointment[]> => {
    await delay(400);
    const all = appointmentService.getAllAppointmentsSync();
    
    if (role === 'patient') {
      return all.filter(a => a.patientId === userId);
    } else if (role === 'doctor') {
      // For demo purposes, we'll match by name if ID isn't set, or return all if admin/test
      // Real app would strictly check doctorId.
      return all; // Returning all for demo if doctor ID logic isn't strictly enforced in auth
    }
    
    return [];
  },

  // Kept for backward compatibility or internal use
  getMyAppointments: async (): Promise<Appointment[]> => {
    await delay(400);
    return appointmentService.getAllAppointmentsSync();
  },

  getAllAppointmentsSync: (): Appointment[] => {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  cancelAppointment: async (id: string): Promise<void> => {
    await delay(500);
    const existing = appointmentService.getAllAppointmentsSync();
    const updated = existing.map(apt => apt.id === id ? { ...apt, status: 'cancelled' as const } : apt);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
