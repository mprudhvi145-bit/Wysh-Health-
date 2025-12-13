
import React from 'react';
import { Appointment } from '../../../types/appointment';
import { Calendar, Clock, Video, MapPin, MoreVertical } from 'lucide-react';
import { Button } from '../../../components/UI';

interface AppointmentListProps {
  appointments: Appointment[];
  loading?: boolean;
}

export const AppointmentList: React.FC<AppointmentListProps> = ({ appointments, loading }) => {
  if (loading) {
    return <div className="text-center py-8 text-text-secondary animate-pulse">Syncing schedule...</div>;
  }

  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-white/10 rounded-lg">
        <p className="text-text-secondary mb-2">No upcoming appointments</p>
      </div>
    );
  }

  // Sort by date/time
  const sorted = [...appointments]
    .filter(a => a.status !== 'cancelled')
    .sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());

  return (
    <div className="space-y-3">
      {sorted.map(apt => (
        <div key={apt.id} className="group relative p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <img src={apt.doctorImage} alt={apt.doctorName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">{apt.doctorName}</h4>
                        <p className="text-xs text-text-secondary">{apt.doctorSpecialty}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${apt.type === 'video' ? 'bg-purple/10 text-purple' : 'bg-teal/10 text-teal'}`}>
                    {apt.type}
                </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-text-secondary mb-3">
                <div className="flex items-center gap-1.5">
                    <Calendar size={12} className="text-teal" />
                    {new Date(apt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={12} className="text-teal" />
                    {apt.time}
                </div>
            </div>

            {apt.type === 'video' && apt.status === 'confirmed' && (
                <a href={apt.meetingLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="primary" className="w-full !py-2 text-xs h-8" icon={<Video size={12} />}>
                        Join Call
                    </Button>
                </a>
            )}
            
             {apt.type === 'in-person' && (
                <div className="flex items-center gap-1.5 text-xs text-text-secondary bg-black/20 p-2 rounded">
                    <MapPin size={12} /> Silicon Valley Main Campus
                </div>
            )}
        </div>
      ))}
    </div>
  );
};
