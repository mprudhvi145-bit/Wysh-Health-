
import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { MessageSquare, Bell, FileText, Pill, Calendar, TestTube, ShieldCheck, AlertCircle } from 'lucide-react';
import { GlassCard, Button } from '../../components/UI';
import { MOCK_DOCTORS } from '../../utils/constants';
import { generateHealthInsight } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types/appointment';
import { AppointmentList } from '../appointments/components/AppointmentList';
import { useNavigate } from 'react-router-dom';
import { RoleLayout } from '../../components/RoleLayout';
import { getDensity } from '../../utils/uiDensity';

const DATA_VISITS = [
  { name: 'Mon', visits: 40 }, { name: 'Tue', visits: 55 }, 
  { name: 'Wed', visits: 45 }, { name: 'Thu', visits: 60 }, 
  { name: 'Fri', visits: 70 }, { name: 'Sat', visits: 35 }, { name: 'Sun', visits: 20 },
];

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const density = getDensity('patient'); // Explicitly fetching for granular control
  
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);

  const handleAiQuery = async () => {
    if(!aiPrompt) return;
    setLoadingAi(true);
    const res = await generateHealthInsight(aiPrompt);
    setAiResponse(res);
    setLoadingAi(false);
  };

  useEffect(() => {
    const fetchAppointments = async () => {
        if(user) {
            const data = await appointmentService.getAppointmentsForUser(user.id, 'patient');
            setAppointments(data);
        }
        setLoadingAppointments(false);
    };
    fetchAppointments();
  }, [user]);

  return (
    <RoleLayout role="patient">
        {/* Header - Calm & Welcoming */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className={density.heading}>
                Hello, {user?.name.split(' ')[0]}
            </h1>
            <p className={density.subheading}>Here is your health summary for today.</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer">
              <Bell className="text-text-secondary group-hover:text-white transition-colors" size={24} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B0C10]" />
            </div>
            <div className="w-12 h-12 rounded-full bg-teal/20 border-2 border-teal flex items-center justify-center text-teal font-bold text-lg overflow-hidden cursor-pointer hover:shadow-[0_0_20px_rgba(69,162,158,0.3)] transition-all" onClick={() => navigate('/profile')}>
               {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : user?.name.substring(0, 2)}
            </div>
          </div>
        </div>

        {/* Action Shortcuts - Large Touch Targets */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           {/* ABHA Shortcut */}
           <GlassCard 
             className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group border-orange-500/20"
             onClick={() => navigate('/abha')}
             hoverEffect={true}
           >
             <div className="p-4 bg-orange-500/10 rounded-2xl text-orange-500 mb-3 group-hover:scale-110 transition-transform">
               <ShieldCheck size={28} />
             </div>
             <span className="text-sm font-bold text-white">ABHA ID</span>
           </GlassCard>

           <GlassCard 
             className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-white/5 transition-colors group"
             onClick={() => navigate('/dashboard/records')}
             hoverEffect={true}
           >
             <div className="p-4 bg-purple/10 rounded-2xl text-purple mb-3 group-hover:scale-110 transition-transform">
               <FileText size={28} />
             </div>
             <span className="text-sm font-bold text-white">Records</span>
           </GlassCard>
           
           <GlassCard 
             className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-white/5 transition-colors group"
             onClick={() => navigate('/doctors')}
             hoverEffect={true}
           >
             <div className="p-4 bg-teal/10 rounded-2xl text-teal mb-3 group-hover:scale-110 transition-transform">
               <Calendar size={28} />
             </div>
             <span className="text-sm font-bold text-white">Book Visit</span>
           </GlassCard>

           <GlassCard 
             className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-white/5 transition-colors group"
             onClick={() => navigate('/dashboard/labs')}
             hoverEffect={true}
           >
             <div className="p-4 bg-blue-500/10 rounded-2xl text-blue-400 mb-3 group-hover:scale-110 transition-transform">
               <TestTube size={28} />
             </div>
             <span className="text-sm font-bold text-white">Results</span>
           </GlassCard>

           <GlassCard 
             className="flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-white/5 transition-colors group"
             onClick={() => navigate('/dashboard/prescriptions')}
             hoverEffect={true}
           >
             <div className="p-4 bg-yellow-500/10 rounded-2xl text-yellow-400 mb-3 group-hover:scale-110 transition-transform">
               <Pill size={28} />
             </div>
             <span className="text-sm font-bold text-white">Meds</span>
           </GlassCard>
        </div>

        {/* Wysh AI Assistant - Conversational & Helpful */}
        <GlassCard className="border-teal/30 bg-teal/5 p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-teal/20 rounded-lg text-teal">
                <MessageSquare size={20} />
              </div>
              <div>
                  <h3 className="font-bold text-white text-lg">Wysh AI Assistant</h3>
                  <p className="text-xs text-teal/80">Personal Health Companion</p>
              </div>
            </div>
            
            <div className="flex gap-3">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="How do I prepare for a blood test?" 
                  className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-base text-white focus:border-teal outline-none transition-all focus:ring-1 focus:ring-teal/50"
                />
                <Button onClick={handleAiQuery} className="py-3 px-6 font-medium">
                  {loadingAi ? 'Thinking...' : 'Ask'}
                </Button>
            </div>
            
            {aiResponse && (
              <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-sm text-text-secondary animate-fadeIn leading-relaxed">
                <strong className="text-teal block mb-2 text-xs uppercase tracking-wider">AI Response</strong>
                {aiResponse}
              </div>
            )}
            
            <div className="flex items-start gap-2 text-xs text-text-secondary opacity-60 bg-black/20 p-2 rounded-lg border border-white/5 w-fit">
                  <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
                  <span>AI summaries are informational. Consult a doctor for medical advice.</span>
            </div>
          </div>
        </GlassCard>

        {/* Main Content Area - Clean & Spacious */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Charts / Main View */}
          <div className="lg:col-span-2 space-y-8">
            <GlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-2">Health Activity</h3>
              <p className="text-sm text-text-secondary mb-6">Your weekly engagement overview</p>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DATA_VISITS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1D2329', border: '1px solid #333', color: '#fff', borderRadius: '8px' }}
                      itemStyle={{ color: '#4D8B83' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="visits" fill="#4D8B83" radius={[6, 6, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

             <GlassCard className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h3 className="text-xl font-bold text-white">Recommended Doctors</h3>
                    <p className="text-sm text-text-secondary mt-1">Based on your recent history</p>
                 </div>
                 <Button variant="outline" onClick={() => navigate('/doctors')} className="text-xs">View All</Button>
              </div>
              <div className="space-y-4">
                {MOCK_DOCTORS.slice(0,2).map(doc => (
                  <div key={doc.id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer group" onClick={() => navigate(`/doctors/${doc.id}`)}>
                    <div className="w-14 h-14 rounded-xl bg-gray-700 flex items-center justify-center text-xs overflow-hidden flex-shrink-0 border border-white/10 group-hover:border-teal/50 transition-colors">
                       <img src={doc.image || ''} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-bold text-lg truncate group-hover:text-teal transition-colors">{doc.name}</h4>
                      <p className="text-text-secondary text-sm truncate">{doc.specialty}</p>
                    </div>
                    <Button variant="secondary" className="px-4 py-2">Book</Button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Appointments */}
          <div className="space-y-8">
            <GlassCard className="h-full flex flex-col p-6">
              <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h3 className="text-xl font-bold text-white">Schedule</h3>
                <span className="text-xs text-teal cursor-pointer hover:underline font-medium" onClick={() => navigate('/doctors')}>+ New Booking</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px] max-h-[500px]">
                <AppointmentList appointments={appointments} loading={loadingAppointments} />
              </div>
              
              <Button variant="outline" className="mt-6 w-full py-3" onClick={() => navigate('/appointments')}>View Full Schedule</Button>
            </GlassCard>
          </div>

        </div>
    </RoleLayout>
  );
};
