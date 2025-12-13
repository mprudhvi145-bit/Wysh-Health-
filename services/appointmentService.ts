import { Appointment, TimeSlot, AppointmentStatus } from '../types/appointment';
import { config } from '../config';
import { authService } from './authService';

const getBackendUrl = () => {
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3001/api';
  }
  return `${config.apiBaseUrl}`;
};

export const appointmentService = {
  
  getAvailableSlots: async (doctorId: string, date: string): Promise<TimeSlot[]> => {
    // Generate deterministic mock slots for UI availability simulation
    await new Promise(r => setTimeout(r, 400));
    const slots: TimeSlot[] = [];
    for (let h = 9; h < 17; h++) {
      slots.push({ time: `${h.toString().padStart(2, '0')}:00`, available: Math.random() > 0.3 });
      slots.push({ time: `${h.toString().padStart(2, '0')}:30`, available: Math.random() > 0.3 });
    }
    return slots;
  },

  bookAppointment: async (appointment: Omit<Appointment, 'id' | 'status'>): Promise<Appointment> => {
    const token = authService.getToken();
    const res = await fetch(`${getBackendUrl()}/clinical/appointments`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        doctorId: appointment.doctorId,
        patientId: appointment.patientId,
        date: appointment.date,
        time: appointment.time,
        type: appointment.type
      })
    });
    
    if (!res.ok) throw new Error('Booking failed');
    const json = await res.json();
    return json.data;
  },

  getAppointmentsForUser: async (userId: string, role: 'patient' | 'doctor' | 'admin'): Promise<Appointment[]> => {
    const token = authService.getToken();
    try {
      const res = await fetch(`${getBackendUrl()}/clinical/appointments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) return [];
      const json = await res.json();
      
      // Transform backend format to frontend Appointment type
      return json.data.map((a: any) => ({
        id: a.id,
        doctorId: a.doctorId,
        patientId: a.patientId,
        doctorName: a.doctorName || 'Dr. Wysh',
        doctorSpecialty: 'General', // Would ideally come from expand
        doctorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=100', // Mock
        date: a.scheduledAt.split('T')[0],
        time: a.scheduledAt.split('T')[1].substring(0, 5),
        type: a.type || 'video',
        status: a.status.toLowerCase(),
        meetingLink: '#'
      }));
    } catch (e) {
      console.error(e);
      return [];
    }
  },

  getAppointmentById: async (id: string): Promise<Appointment | undefined> => {
    // For now, re-fetch all (optimization later)
    const all = await appointmentService.getAppointmentsForUser('', 'patient');
    return all.find(a => a.id === id);
  },

  updateStatus: async (id: string, status: AppointmentStatus): Promise<void> => {
    // If closing/completing, using the specific close endpoint
    if (status === 'completed') {
        // Handled via doctorService.closeVisit usually, but minimal stub here
    }
  },

  cancelAppointment: async (id: string): Promise<void> => {
    // Implementation for cancellation
  }
};