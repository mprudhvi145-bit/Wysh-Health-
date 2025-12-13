
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { Appointment } from '../../types/appointment';
import { MOCK_PATIENTS } from '../../utils/constants'; // Use constant or service
import { DoctorDashboardView } from './DoctorDashboardView';
import { Loader } from '../../components/UI';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
        if(user) {
            try {
                const data = await appointmentService.getAppointmentsForUser(user.id, 'doctor');
                setAppointments(data);
            } catch (err) {
                console.error("Failed to load dashboard data", err);
            }
        }
        setLoading(false);
    };
    init();
  }, [user]);

  const toggleAvailability = async () => {
      const newState = !isOnline;
      setIsOnline(newState);
      if(user) {
          try {
            await doctorService.updateStatus(user.id, newState);
          } catch(e) {
            console.error("Failed to update status");
            setIsOnline(!newState); // Revert on error
          }
      }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Loading Dashboard..." /></div>;

  return (
    <DoctorDashboardView 
        user={user}
        appointments={appointments}
        isOnline={isOnline}
        toggleAvailability={toggleAvailability}
        patientCount={MOCK_PATIENTS.length}
    />
  );
};
