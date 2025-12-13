
export type AppointmentType = 'video' | 'in-person';
export type AppointmentStatus = 'confirmed' | 'completed' | 'cancelled' | 'scheduled' | 'in_progress';

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorImage: string;
  patientId: string;
  date: string; // ISO Date string YYYY-MM-DD
  time: string; // HH:mm
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  meetingLink?: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
