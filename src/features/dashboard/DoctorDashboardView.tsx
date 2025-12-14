
import React from 'react';
import { Users, Calendar, Activity, Clock, Video, Power, ClipboardList } from 'lucide-react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { Appointment } from '../../types/appointment';
import { useNavigate } from 'react-router-dom';
import { RoleLayout } from '../../components/RoleLayout';
import { getDensity } from '../../utils/uiDensity';

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
  const density = getDensity('doctor');
  const todayAppointments = appointments; // In real app, filter for today

  return (
    <RoleLayout role="doctor">
        {/* Header - Compact & Functional */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-b border-white/5 pb-4">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-teal/20 rounded-lg flex items-center justify-center text-teal font-bold border border-teal/30">
                    DR
                </div>
                <div>
                    <h1 className={density.heading}>
                        Clinical Station
                    </h1>
                    <p className={density.subheading}>Dr. {user?.name} • Cardiology Dept</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3">
                 <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border transition-all ${isOnline ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/10 border-red-500/30'}`}>
                     <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                     <span className={`text-xs font-bold uppercase tracking-wider ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
                         {isOnline ? 'Online' : 'Offline'}
                     </span>
                 </div>
                 <Button 
                    variant="outline" 
                    className="!p-1.5 h-8 w-8 justify-center" 
                    onClick={toggleAvailability}
                    icon={<Power size={14} />}
                 />
            </div>
        </div>

        {/* Quick Stats - High Density Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <GlassCard className="p-3 flex items-center gap-3 cursor-pointer hover:border-purple/50 border-white/5" onClick={() => navigate('/appointments')}>
                 <div className="p-2 bg-purple/10 rounded text-purple"><Calendar size={18} /></div>
                 <div>
                     <h3 className="text-lg font-bold text-white leading-none">{todayAppointments.length}</h3>
                     <p className="text-[10px] text-text-secondary uppercase tracking-wider mt-1">Appointments</p>
                 </div>
             </GlassCard>
             <GlassCard className="p-3 flex items-center gap-3 cursor-pointer hover:border-teal/50 border-white/5" onClick={() => navigate('/doctor/patients')}>
                 <div className="p-2 bg-teal/10 rounded text-teal"><Users size={18} /></div>
                 <div>
                     <h3 className="text-lg font-bold text-white leading-none">{patientCount}</h3>
                     <p className="text-[10px] text-text-secondary uppercase tracking-wider mt-1">Total Patients</p>
                 </div>
             </GlassCard>
             <GlassCard className="p-3 flex items-center gap-3 border-white/5">
                 <div className="p-2 bg-blue-500/10 rounded text-blue-400"><Activity size={18} /></div>
                 <div>
                     <h3 className="text-lg font-bold text-white leading-none">98%</h3>
                     <p className="text-[10px] text-text-secondary uppercase tracking-wider mt-1">Outcome</p>
                 </div>
             </GlassCard>
             <GlassCard className="p-3 flex items-center gap-3 border-white/5">
                 <div className="p-2 bg-yellow-500/10 rounded text-yellow-400"><Clock size={18} /></div>
                 <div>
                     <h3 className="text-lg font-bold text-white leading-none">4h 30m</h3>
                     <p className="text-[10px] text-text-secondary uppercase tracking-wider mt-1">Consult Time</p>
                 </div>
             </GlassCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[calc(100vh-280px)] min-h-[500px]">
            {/* Left: Schedule - Maximized List View */}
            <div className="lg:col-span-2 h-full">
                <GlassCard className="h-full flex flex-col p-0 overflow-hidden">
                    <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
                        <h3 className="text-white font-bold text-sm">Today's Schedule</h3>
                        <div className="flex gap-2">
                            <Button variant="outline" className="text-[10px] h-6 px-2" onClick={() => navigate('/doctor/schedule')}>Slots</Button>
                            <Button variant="primary" className="text-[10px] h-6 px-2">Start Next</Button>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {todayAppointments.length === 0 ? (
                             <div className="text-center py-12 border border-dashed border-white/10 rounded-xl m-2">
                                <p className="text-text-secondary text-xs">No appointments scheduled.</p>
                             </div>
                        ) : (
                            todayAppointments.map(apt => (
                                <div key={apt.id} className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded hover:bg-white/10 transition-colors group cursor-pointer" onClick={() => navigate(`/appointments/${apt.id}`)}>
                                    <div className="text-center min-w-[50px] bg-black/30 rounded p-1">
                                        <p className="text-white font-bold text-sm leading-none">{apt.time}</p>
                                    </div>
                                    <div className="w-8 h-8 rounded bg-purple/20 flex items-center justify-center text-purple font-bold text-xs">
                                        {apt.doctorName.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-white font-bold text-xs truncate">ID: {apt.patientId}</h4>
                                            <span className="text-[10px] px-1.5 rounded bg-teal/10 text-teal border border-teal/20">{apt.type}</span>
                                        </div>
                                        <p className="text-[10px] text-text-secondary truncate">Follow-up • Insurance Verified</p>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {apt.type === 'video' && (
                                            <Button variant="primary" className="!py-1 !px-2 text-[10px] h-6" icon={<Video size={10}/>}>
                                                Join
                                            </Button>
                                        )}
                                        <Button variant="outline" className="!py-1 !px-2 text-[10px] h-6">Chart</Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Right: Quick Actions & Recent - Dense */}
            <div className="space-y-4 h-full flex flex-col">
                <div 
                    className="bg-gradient-to-r from-teal/20 to-teal/5 border border-teal/20 rounded-xl p-4 flex justify-between items-center cursor-pointer hover:border-teal/50 transition-colors group"
                    onClick={() => navigate('/doctor/patients')}
                >
                    <div>
                        <h3 className="text-sm font-bold text-white group-hover:text-teal transition-colors">Clinical Console</h3>
                        <p className="text-[10px] text-text-secondary">Full patient management suite</p>
                    </div>
                    <div className="bg-teal text-white p-2 rounded-lg group-hover:scale-110 transition-transform">
                        <ClipboardList size={16} />
                    </div>
                </div>

                <GlassCard className="flex-1 flex flex-col p-0 overflow-hidden">
                    <div className="flex justify-between items-center p-3 border-b border-white/10 bg-white/5">
                        <h3 className="text-white font-bold text-sm">Active Roster</h3>
                        <Badge color="purple">Live</Badge>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-2 space-y-1">
                        {/* Mock Roster */}
                        {[1,2,3,4].map(i => (
                            <div key={i} className="p-2 rounded border border-white/5 hover:border-white/20 transition-all cursor-pointer bg-white/5">
                                <div className="flex justify-between items-center mb-1">
                                    <h4 className="text-white font-bold text-xs">Patient #{9000+i}</h4>
                                    <span className="text-[9px] px-1.5 rounded bg-green-500/20 text-green-300">Stable</span>
                                </div>
                                <div className="flex justify-between text-[10px] text-text-secondary">
                                    <span>Age: 34</span>
                                    <span>Last: 2d ago</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-2 border-t border-white/10">
                        <Button 
                            variant="outline" 
                            className="w-full text-[10px] h-7" 
                            onClick={() => navigate('/doctor/patients')}
                        >
                            View All
                        </Button>
                    </div>
                </GlassCard>
            </div>
        </div>
    </RoleLayout>
  );
};
