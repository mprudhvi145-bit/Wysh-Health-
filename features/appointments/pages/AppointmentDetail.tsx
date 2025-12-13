
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentService } from '../../../services/appointmentService';
import { generateHealthInsight } from '../../../services/geminiService';
import { Appointment } from '../../../types/appointment';
import { GlassCard, Button, Badge, Loader, Modal } from '../../../components/UI';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  ArrowLeft, Calendar, Clock, Video, MapPin, User, FileText, 
  XCircle, CheckCircle, AlertTriangle, Brain 
} from 'lucide-react';

export const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (id) {
        const data = await appointmentService.getAppointmentById(id);
        setAppointment(data || null);
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleStatusChange = async (status: 'cancelled' | 'completed') => {
    if (!appointment) return;
    await appointmentService.updateStatus(appointment.id, status);
    setAppointment({ ...appointment, status });
    setCancelModal(false);
    addNotification(status === 'cancelled' ? 'info' : 'success', `Appointment marked as ${status}`);
  };

  const handleGenerateSummary = async () => {
    if (!appointment) return;
    setGeneratingAi(true);
    const prompt = `Generate a pre-visit summary for a ${appointment.type} appointment with ${appointment.doctorName} (${appointment.doctorSpecialty}). Patient notes: ${appointment.notes || 'None'}. Date: ${appointment.date}.`;
    const summary = await generateHealthInsight(prompt);
    setAiSummary(summary);
    setGeneratingAi(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader /></div>;
  if (!appointment) return <div className="p-10 text-center text-white">Appointment not found</div>;

  const isPast = new Date(`${appointment.date}T${appointment.time}`) < new Date();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={() => navigate(-1)} icon={<ArrowLeft size={14} />} className="text-xs !py-2 !px-3">
        Back
      </Button>

      {/* Header */}
      <GlassCard className="relative overflow-hidden">
        <div className={`absolute top-0 left-0 w-2 h-full ${
          appointment.status === 'confirmed' ? 'bg-teal' : 
          appointment.status === 'cancelled' ? 'bg-red-500' : 'bg-purple'
        }`} />
        
        <div className="pl-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <div className="flex items-center gap-3 mb-2">
               <h1 className="text-2xl font-bold text-white">
                 {user?.role === 'patient' ? `Visit with ${appointment.doctorName}` : `Patient ID: ${appointment.patientId}`}
               </h1>
               <Badge color={appointment.status === 'cancelled' ? 'purple' : 'teal'}>{appointment.status}</Badge>
             </div>
             <p className="text-text-secondary text-sm flex items-center gap-2">
               <span className="font-mono text-teal">#{appointment.id}</span>
               <span>•</span>
               <span>{appointment.type === 'video' ? 'Telemedicine' : 'In-Person Visit'}</span>
             </p>
          </div>

          <div className="flex gap-3">
             {appointment.status === 'confirmed' && !isPast && (
               <Button 
                  variant="outline" 
                  className="!py-2 text-sm border-red-500/30 text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                  onClick={() => setCancelModal(true)}
               >
                 Cancel
               </Button>
             )}
             {appointment.status === 'confirmed' && appointment.type === 'video' && (
                <a href={appointment.meetingLink} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary" className="!py-2 text-sm" icon={<Video size={16} />}>Join Call</Button>
                </a>
             )}
          </div>
        </div>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Details Column */}
        <div className="md:col-span-2 space-y-6">
           <GlassCard>
             <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <FileText size={18} className="text-teal" /> Appointment Details
             </h3>
             <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                   <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Date</label>
                   <p className="text-white font-medium flex items-center gap-2">
                     <Calendar size={16} className="text-teal" /> {appointment.date}
                   </p>
                </div>
                <div>
                   <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Time</label>
                   <p className="text-white font-medium flex items-center gap-2">
                     <Clock size={16} className="text-teal" /> {appointment.time}
                   </p>
                </div>
                <div>
                   <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Doctor</label>
                   <p className="text-white font-medium flex items-center gap-2">
                     <User size={16} className="text-teal" /> {appointment.doctorName}
                   </p>
                   <p className="text-xs text-text-secondary ml-6">{appointment.doctorSpecialty}</p>
                </div>
                <div>
                   <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Location</label>
                   <p className="text-white font-medium flex items-center gap-2">
                     {appointment.type === 'video' ? <Video size={16} className="text-purple" /> : <MapPin size={16} className="text-purple" />}
                     {appointment.type === 'video' ? 'Secure Video Room' : 'Wysh Main Campus'}
                   </p>
                </div>
             </div>
             
             <div className="pt-4 border-t border-white/10">
               <label className="text-xs text-text-secondary uppercase tracking-wider block mb-2">Patient Notes</label>
               <p className="text-white/80 text-sm bg-white/5 p-3 rounded-lg border border-white/5">
                 {appointment.notes || "No notes provided."}
               </p>
             </div>
           </GlassCard>

           {/* AI Summary Section */}
           <GlassCard className="border-teal/20 bg-teal/5">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Brain size={18} className="text-teal" /> AI Pre-Visit Insight
                </h3>
                {!aiSummary && (
                  <Button 
                    variant="outline" 
                    className="!py-1 !px-3 text-xs" 
                    onClick={handleGenerateSummary}
                    disabled={generatingAi}
                  >
                    {generatingAi ? 'Generating...' : 'Generate Insight'}
                  </Button>
                )}
             </div>
             
             {aiSummary ? (
               <div className="text-sm text-text-secondary leading-relaxed animate-fadeIn">
                 {aiSummary}
               </div>
             ) : (
               <p className="text-sm text-text-secondary italic">
                 Click generate to get an AI-powered summary and preparation checklist for this visit.
               </p>
             )}
           </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <GlassCard className="text-center">
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-white/10 mb-4">
                 <img src={appointment.doctorImage} alt="Doctor" className="w-full h-full object-cover" />
              </div>
              <h3 className="text-white font-bold">{appointment.doctorName}</h3>
              <p className="text-teal text-sm mb-4">{appointment.doctorSpecialty}</p>
              <Button variant="outline" className="w-full text-xs" onClick={() => navigate(`/doctors/${appointment.doctorId}`)}>
                View Profile
              </Button>
           </GlassCard>

           <GlassCard>
              <h4 className="text-white font-bold text-sm mb-3">Need Help?</h4>
              <p className="text-xs text-text-secondary mb-4">
                Issues with connecting? Contact our 24/7 support team.
              </p>
              <Button variant="outline" className="w-full text-xs">Contact Support</Button>
           </GlassCard>
        </div>
      </div>

      {/* Cancel Modal */}
      <Modal isOpen={cancelModal} onClose={() => setCancelModal(false)} title="Cancel Appointment">
        <div className="space-y-4">
           <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <AlertTriangle className="text-red-400 flex-shrink-0" />
              <div>
                 <h4 className="text-white font-bold text-sm">Are you sure?</h4>
                 <p className="text-text-secondary text-xs mt-1">
                   This action cannot be undone. You will need to re-book a new slot if you change your mind.
                 </p>
              </div>
           </div>
           <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setCancelModal(false)}>Keep Appointment</Button>
              <Button 
                variant="primary" 
                className="bg-red-500 hover:bg-red-600 border-red-500" 
                onClick={() => handleStatusChange('cancelled')}
              >
                Confirm Cancellation
              </Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};
