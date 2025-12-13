
import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, Activity, CheckCircle, Clock, Video, Power 
} from 'lucide-react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { Appointment } from '../../types/appointment';
import { MOCK_PATIENTS } from '../../utils/constants';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isOnline, setIsOnline] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
        if(user) {
            const data = await appointmentService.getAppointmentsForUser(user.id, 'doctor');
            setAppointments(data);
        }
        setLoading(false);
    };
    init();
  }, [user]);

  const toggleAvailability = async () => {
      const newState = !isOnline;
      setIsOnline(newState);
      if(user) {
          await doctorService.updateStatus(user.id, newState);
      }
  };

  const todayAppointments = appointments.filter(a => {
      const today = new Date().toISOString().split('T')[0];
      // For demo, since we generate slots 7 days out, assume we want to see all for now or mock it
      return true; // Return all for demo visibility
  });

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
             <GlassCard className="py-4 flex items-center gap-4">
                 <div className="p-3 bg-purple/10 rounded-lg text-purple"><Calendar size={20} /></div>
                 <div>
                     <h3 className="text-2xl font-bold text-white">{todayAppointments.length}</h3>
                     <p className="text-xs text-text-secondary uppercase">Appointments</p>
                 </div>
             </GlassCard>
             <GlassCard className="py-4 flex items-center gap-4">
                 <div className="p-3 bg-teal/10 rounded-lg text-teal"><Users size={20} /></div>
                 <div>
                     <h3 className="text-2xl font-bold text-white">{MOCK_PATIENTS.length}</h3>
                     <p className="text-xs text-text-secondary uppercase">Total Patients</p>
                 </div>
             </GlassCard>
             <GlassCard className="py-4 flex items-center gap-4">
                 <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Activity size={20} /></div>
                 <div>
                     <h3 className="text-2xl font-bold text-white">98%</h3>
                     <p className="text-xs text-text-secondary uppercase">Patient Satisfaction</p>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Schedule */}
            <div className="lg:col-span-2 space-y-6">
                <GlassCard className="min-h-[500px]">
                    <h3 className="text-white font-bold mb-6">Today's Schedule</h3>
                    
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
                                        {apt.doctorName.charAt(0)} {/* Using DoctorName for demo, ideally PatientName */}
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
                                        <Button variant="outline" className="!py-1 !px-3 text-xs h-8">Details</Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>
            </div>

            {/* Right: Patient List */}
            <GlassCard>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-white font-bold">Recent Patients</h3>
                    <Badge color="purple">Active List</Badge>
                </div>
                
                <div className="space-y-4">
                    {MOCK_PATIENTS.map(patient => (
                        <div key={patient.id} className="p-3 rounded-lg border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="text-white font-bold text-sm">{patient.name}</h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    patient.status === 'Critical' ? 'bg-red-500/20 text-red-300' : 
                                    patient.status === 'Active' ? 'bg-green-500/20 text-green-300' : 
                                    'bg-white/10 text-text-secondary'
                                }`}>
                                    {patient.status}
                                </span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-xs text-text-secondary">
                                <div>Age: <span className="text-white">{patient.age}</span></div>
                                <div>Last: <span className="text-white">{patient.lastVisit}</span></div>
                                <div className="col-span-2 text-teal truncate">{patient.condition}</div>
                            </div>
                        </div>
                    ))}
                </div>
                <Button variant="outline" className="w-full mt-6 text-sm">View All Patients</Button>
            </GlassCard>
        </div>
    </div>
  );
};
