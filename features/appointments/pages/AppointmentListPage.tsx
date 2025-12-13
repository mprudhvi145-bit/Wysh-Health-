
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button, Loader, Badge } from '../../../components/UI';
import { useAuth } from '../../../context/AuthContext';
import { appointmentService } from '../../../services/appointmentService';
import { Appointment } from '../../../types/appointment';
import { Calendar, Clock, MapPin, Video, ChevronRight } from 'lucide-react';

export const AppointmentListPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');

  useEffect(() => {
    const fetch = async () => {
      if (!user) return;
      const data = await appointmentService.getAppointmentsForUser(user.id, user.role === 'doctor' ? 'doctor' : 'patient');
      setAppointments(data);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const filtered = appointments.filter(apt => {
    const aptDate = new Date(`${apt.date}T${apt.time}`);
    const now = new Date();
    
    if (apt.status === 'cancelled' || apt.status === 'completed') {
      return activeTab === 'history';
    }

    if (activeTab === 'upcoming') {
      return aptDate >= now;
    } else {
      return aptDate < now;
    }
  }).sort((a, b) => {
      const d1 = new Date(`${a.date}T${a.time}`).getTime();
      const d2 = new Date(`${b.date}T${b.time}`).getTime();
      return activeTab === 'upcoming' ? d1 - d2 : d2 - d1;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Syncing Schedule..." /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-white">Your Appointments</h1>
          <p className="text-text-secondary text-sm">Manage bookings and view visit history.</p>
        </div>
        <div className="flex p-1 bg-white/5 rounded-lg border border-white/10">
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'upcoming' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'history' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
          >
            History
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <GlassCard className="text-center py-16 border-dashed border-white/10">
            <Calendar className="mx-auto text-text-secondary mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No {activeTab} appointments</h3>
            <p className="text-text-secondary mb-6">Your schedule is clear.</p>
            {activeTab === 'upcoming' && user?.role === 'patient' && (
               <Button onClick={() => navigate('/doctors')}>Book Appointment</Button>
            )}
          </GlassCard>
        ) : (
          filtered.map(apt => (
            <GlassCard 
              key={apt.id} 
              className="flex flex-col md:flex-row items-center gap-6 group cursor-pointer hover:border-teal/30"
              onClick={() => navigate(`/appointments/${apt.id}`)}
            >
              <div className="flex-shrink-0 text-center min-w-[80px] bg-white/5 rounded-xl p-3 border border-white/5">
                <span className="block text-xs uppercase text-teal font-bold tracking-wider">
                  {new Date(apt.date).toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="block text-2xl font-bold text-white font-display">
                  {new Date(apt.date).getDate()}
                </span>
                <span className="block text-xs text-text-secondary">
                  {new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              </div>

              <div className="flex-1 min-w-0 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <h3 className="text-lg font-bold text-white truncate">
                    {user?.role === 'patient' ? apt.doctorName : `Patient ID: ${apt.patientId}`}
                  </h3>
                  <Badge color={apt.status === 'cancelled' ? 'purple' : 'teal'}>
                    {apt.status}
                  </Badge>
                </div>
                <p className="text-text-secondary text-sm mb-2">
                   {user?.role === 'patient' ? apt.doctorSpecialty : 'General Checkup'}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 text-xs text-text-secondary">
                  <span className="flex items-center gap-1"><Clock size={14} /> {apt.time}</span>
                  <span className="flex items-center gap-1">
                    {apt.type === 'video' ? <Video size={14} /> : <MapPin size={14} />}
                    {apt.type === 'video' ? 'Telemedicine' : 'In-Person'}
                  </span>
                </div>
              </div>

              <div className="flex-shrink-0">
                <Button variant="outline" className="text-xs group-hover:bg-teal group-hover:text-white group-hover:border-teal">
                  Details <ChevronRight size={14} />
                </Button>
              </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};
