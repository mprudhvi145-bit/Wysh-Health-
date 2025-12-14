
import React from 'react';
import { Users, Calendar, Activity, Clock, Video, Power, ClipboardList } from 'lucide-react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { Appointment } from '../../types/appointment';
import { useNavigate } from 'react-router-dom';

interface DoctorDashboardViewProps {
  user: any;
  appointments: Appointment[];
  isOnline: boolean;
  toggleAvailability: () => void;
  patientCount: number;
}

export const DoctorDashboardView: React.FC<DoctorDashboardViewProps> = ({
  user,
  appointments,
  isOnline,
  toggleAvailability,
  patientCount
}) => {
  const navigate = useNavigate();
  const todayAppointments = appointments; // In real app, filter for today

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">
                    Hospital OS <span className="text-purple text-sm align-top ml-2">Clinician View</span>
                </h1>
                <p className="text-text-secondary text-sm">Dr. {user?.name} • Cardiology</p>
            </div>
            
            <div className="flex items-center gap-4">
                 <div className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${isOnline ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                     <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                     <span className={`text-sm font-bold ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                         {isOnline ? 'Accepting Visits' : 'Offline'}
                     </span>
                 </div>
                 <Button 
                    variant="outline" 
                    className="!p-2 h-10 w-10 justify-center" 
                    onClick={toggleAvailability}
                    icon={<Power size={18} />}
                 />
            </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
             <GlassCard className="py-4 flex items-center gap-4 cursor-pointer hover:border-purple/50" onClick={() => navigate('/appointments')}>
                 <div className="p-3 bg-purple/10 rounded-lg text-purple"><Calendar size={20} /></div>
                 <div>
                     <h3 className="text-2xl font-bold text-white">{todayAppointments.length}</h3>
                     <p className="text-xs text-text-secondary uppercase">Appointments</p>
                 </div>
             </GlassCard>
             <GlassCard className="py-4 flex items-center gap-4 cursor-pointer hover:border-teal/50" onClick={() => navigate('/doctor/patients')}>
                 <div className="p-3 bg-teal/10 rounded-lg text-teal"><Users size={20} /></div>
                 <div>
                     <h3 className="text-2xl font-bold text-white">{patientCount}</h3>
                     <p className="text-xs text-text-secondary uppercase">Total Patients</p>
                 </div>
             </GlassCard>
             <GlassCard className="py-4 flex items-center gap-4">
                 <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Activity size={20} /></div>
                 <div>
                     <h3 className="text-2xl font-bold text-white">98%</h3>
                     <p className="text-xs text-text-secondary uppercase">Satisfaction</p>
                 </div>
             </GlassCard>
             <GlassCard className="py-4 flex items-center gap-4">
                 <div className="p-3 bg-yellow-500/10 rounded-lg text-yellow-400"><Clock size={20} /></div>
                 <div>
                     <h3 className="text-2xl font-bold text-white">4h 30m</h3>
                     <p className="text-xs text-text-secondary uppercase">Consult Time</p>
                 </div>
             </GlassCard>
        </div>

        {/* Clinical Actions CTA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div 
             className="bg-gradient-to-r from-teal/20 to-teal/5 border border-teal/20 rounded-2xl p-6 flex justify-between items-center cursor-pointer hover:border-teal/50 transition-colors group"
             onClick={() => navigate('/doctor/patients')}
           >
             <div>
               <h3 className="text-xl font-bold text-white mb-1 group-hover:text-teal transition-colors">Clinical Console</h3>
               <p className="text-text-secondary text-sm">Manage patients, write prescriptions, and view labs.</p>
             </div>
             <div className="bg-teal text-white p-3 rounded-full group-hover:scale-110 transition-transform">
               <ClipboardList size={24} />
             </div>
           </div>
           
           <div className="bg-gradient-to-r from-purple/20 to-purple/5 border border-purple/20 rounded-2xl p-6 flex justify-between items-center cursor-pointer hover:border-purple/50 transition-colors group" onClick={() => navigate('/ai-health')}>
             <div>
               <h3 className="text-xl font-bold text-white mb-1 group-hover:text-purple transition-colors">AI Research Hub</h3>
               <p className="text-text-secondary text-sm">Analyze complex cases with Gemini Medical Models.</p>
             </div>
             <div className="bg-purple text-white p-3 rounded-full group-hover:scale-110 transition-transform">
               <Activity size={24} />
             </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Schedule */}
            <div className="lg:col-span-2 space-y-6">
                <GlassCard className="min-h-[500px]">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-bold">Today's Schedule</h3>
                        <Button variant="outline" className="text-xs h-8" onClick={() => navigate('/doctor/schedule')}>Manage Slots</Button>
                    </div>
                    
                    <div className="space-y-3">
                        {todayAppointments.length === 0 ? (
                             <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
                                <p className="text-text-secondary">No appointments scheduled for today.</p>
                             </div>
                        ) : (
                            todayAppointments.map(apt => (
                                <div key={apt.id} className="flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors">
                                    <div className="text-center min-w-[60px]">
                                        <p className="text-white font-bold">{apt.time}</p>
                                        <p className="text-xs text-text-secondary">Today</p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-purple/20 flex items-center justify-center text-purple font-bold">
                                        {apt.doctorName.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-white font-bold text-sm">Patient ID: {apt.patientId}</h4>
                                        <p className="text-xs text-text-secondary">{apt.type === 'video' ? 'Telemedicine Consult' : 'In-Person Visit'}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        {apt.type === 'video' && (
                                            <Button variant="primary" className="!py-1 !px-3 text-xs h-8" icon={<Video size={12}/>}>
                                                Join
                                            </Button>
                                        )}
                                        <Button variant="outline" className="!py-1 !px-3 text-xs h-8" onClick={() => navigate(`/appointments/${apt.id}`)}>Details</Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Right: Patient List Summary */}
            <GlassCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold">Recent Patients</h3>
                    <Badge color="purple">Active List</Badge>
                </div>
                
                {/* Visual placeholder since we don't pass the full mock list here to keep props clean */}
                <div className="text-center py-8 text-text-secondary">
                    <p className="text-sm mb-4">Access full roster in Clinical Console</p>
                    <Button 
                        variant="outline" 
                        className="w-full text-sm" 
                        onClick={() => navigate('/doctor/patients')}
                    >
                        Go to Patient Manager
                    </Button>
                </div>
            </GlassCard>
        </div>
    </div>
  );
};
