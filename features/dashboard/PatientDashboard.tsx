import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { MessageSquare, Bell, FileText, Pill, Calendar, TestTube, ShieldCheck } from 'lucide-react';
import { GlassCard, Button } from '../../components/UI';
import { MOCK_DOCTORS } from '../../utils/constants';
import { generateHealthInsight } from '../../services/geminiService';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { Appointment } from '../../types/appointment';
import { AppointmentList } from '../appointments/components/AppointmentList';
import { useNavigate } from 'react-router-dom';

const DATA_VISITS = [
  { name: 'Mon', visits: 40 }, { name: 'Tue', visits: 55 }, 
  { name: 'Wed', visits: 45 }, { name: 'Thu', visits: 60 }, 
  { name: 'Fri', visits: 70 }, { name: 'Sat', visits: 35 }, { name: 'Sun', visits: 20 },
];

export const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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
    <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-white">
                My Health Portal <span className="text-teal text-sm align-top ml-2">v4.0</span>
            </h1>
            <p className="text-text-secondary text-sm">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Bell className="text-text-secondary hover:text-white cursor-pointer" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
            </div>
            <div className="w-10 h-10 rounded-full bg-teal/20 border border-teal flex items-center justify-center text-teal font-bold uppercase overflow-hidden cursor-pointer" onClick={() => navigate('/profile')}>
               {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : user?.name.substring(0, 2)}
            </div>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
           {/* ABHA Shortcut - New */}
           <GlassCard 
             className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-orange-500/10 hover:border-orange-500/30 transition-all group border-orange-500/20"
             onClick={() => navigate('/abha')}
             hoverEffect={false}
           >
             <div className="p-3 bg-orange-500/10 rounded-full text-orange-500 mb-2 group-hover:scale-110 transition-transform">
               <ShieldCheck size={24} />
             </div>
             <span className="text-sm font-bold text-white">ABHA ID</span>
           </GlassCard>

           <GlassCard 
             className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/5 transition-colors group"
             onClick={() => navigate('/dashboard/records')}
             hoverEffect={false}
           >
             <div className="p-3 bg-purple/10 rounded-full text-purple mb-2 group-hover:scale-110 transition-transform">
               <FileText size={24} />
             </div>
             <span className="text-sm font-bold text-white">Records</span>
           </GlassCard>
           
           <GlassCard 
             className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/5 transition-colors group"
             onClick={() => navigate('/doctors')}
             hoverEffect={false}
           >
             <div className="p-3 bg-teal/10 rounded-full text-teal mb-2 group-hover:scale-110 transition-transform">
               <Calendar size={24} />
             </div>
             <span className="text-sm font-bold text-white">Book Visit</span>
           </GlassCard>

           <GlassCard 
             className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/5 transition-colors group"
             onClick={() => navigate('/dashboard/labs')}
             hoverEffect={false}
           >
             <div className="p-3 bg-blue-500/10 rounded-full text-blue-400 mb-2 group-hover:scale-110 transition-transform">
               <TestTube size={24} />
             </div>
             <span className="text-sm font-bold text-white">Lab Results</span>
           </GlassCard>

           <GlassCard 
             className="flex flex-col items-center justify-center p-4 cursor-pointer hover:bg-white/5 transition-colors group"
             onClick={() => navigate('/dashboard/prescriptions')}
             hoverEffect={false}
           >
             <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-400 mb-2 group-hover:scale-110 transition-transform">
               <Pill size={24} />
             </div>
             <span className="text-sm font-bold text-white">Meds</span>
           </GlassCard>
        </div>

        {/* Wysh AI Assistant */}
        <GlassCard className="border-teal/30 bg-teal/5">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare size={16} className="text-teal" />
                <h3 className="font-bold text-white">Wysh AI Assistant</h3>
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Ask about your symptoms, medications, or appointments..." 
                  className="flex-1 bg-black/30 border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-teal outline-none"
                />
                <Button onClick={handleAiQuery} className="!py-2 !px-4 text-sm">
                  {loadingAi ? 'Thinking...' : 'Ask AI'}
                </Button>
              </div>
            </div>
            {aiResponse && (
              <div className="flex-1 bg-black/20 p-3 rounded border border-white/5 text-sm text-text-secondary animate-fadeIn">
                <strong className="text-teal block mb-1">Response:</strong>
                {aiResponse}
              </div>
            )}
          </div>
        </GlassCard>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Charts / Main View */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard>
              <h3 className="text-white font-bold mb-6">Health Activity Overview</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={DATA_VISITS}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                    <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} />
                    <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1D2329', border: '1px solid #333', color: '#fff' }}
                      itemStyle={{ color: '#4D8B83' }}
                      cursor={{fill: 'rgba(255,255,255,0.05)'}}
                    />
                    <Bar dataKey="visits" fill="#4D8B83" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>

             <GlassCard>
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-white font-bold">Recommended Doctors</h3>
                 <span className="text-xs text-teal cursor-pointer hover:underline" onClick={() => navigate('/doctors')}>View Directory</span>
              </div>
              <div className="space-y-4">
                {MOCK_DOCTORS.slice(0,2).map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 cursor-pointer" onClick={() => navigate(`/doctors/${doc.id}`)}>
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-xs overflow-hidden flex-shrink-0">
                       <img src={doc.image || ''} alt={doc.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">{doc.name}</h4>
                      <p className="text-text-secondary text-xs truncate">{doc.specialty}</p>
                    </div>
                    <Button variant="outline" className="!py-1 !px-3 text-xs h-8">Book</Button>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* Right Column: Appointments */}
          <div className="space-y-6">
            <GlassCard className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6 flex-shrink-0">
                <h3 className="text-white font-bold">Upcoming Appointments</h3>
                <span className="text-xs text-teal cursor-pointer hover:underline" onClick={() => navigate('/doctors')}>New Booking</span>
              </div>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-[200px] max-h-[500px] cursor-pointer" onClick={() => navigate('/appointments')}>
                <AppointmentList appointments={appointments} loading={loadingAppointments} />
              </div>
              
              <Button variant="outline" className="mt-4 w-full text-xs" onClick={() => navigate('/appointments')}>View All</Button>
            </GlassCard>
          </div>

        </div>
    </div>
  );
};