
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { appointmentService } from '../../../services/appointmentService';
import { clinicalService } from '../../doctor/services/clinicalService';
import { generateHealthInsight } from '../../../services/geminiService';
import { Appointment } from '../../../types/appointment';
import { GlassCard, Button, Badge, Loader, Modal, Input } from '../../../components/UI';
import { useAuth } from '../../../context/AuthContext';
import { useNotification } from '../../../context/NotificationContext';
import { 
  ArrowLeft, Calendar, Clock, Video, MapPin, User, FileText, 
  XCircle, CheckCircle, AlertTriangle, Brain, Play, Stethoscope, Save 
} from 'lucide-react';

// Import Clinical Context & Tabs
import { ClinicalProvider } from '../../doctor/context/ClinicalContext';
import { useClinical } from '../../doctor/hooks/useClinical';
import OverviewTab from '../../doctor/pages/tabs/OverviewTab';
import PrescriptionsTab from '../../doctor/pages/tabs/PrescriptionsTab';
import LabsTab from '../../doctor/pages/tabs/LabsTab';
import NotesTab from '../../doctor/pages/tabs/NotesTab';
import DocumentsTab from '../../doctor/pages/tabs/DocumentsTab';

// Doctor View Component (Stateful)
const DoctorAppointmentView: React.FC<{ appointment: Appointment, refresh: () => void }> = ({ appointment, refresh }) => {
  const { loadPatient, patient } = useClinical();
  const { addNotification } = useNotification();
  const [activeTab, setActiveTab] = useState<'overview' | 'rx' | 'labs' | 'notes' | 'docs'>('overview');
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [closing, setClosing] = useState(false);

  // Close Form State
  const [diagnosis, setDiagnosis] = useState("");
  const [notes, setNotes] = useState("");
  const [followUp, setFollowUp] = useState("");

  useEffect(() => {
    if (appointment.patientId) {
      loadPatient(appointment.patientId);
    }
  }, [appointment.patientId, loadPatient]);

  const handleStart = async () => {
    try {
      await clinicalService.startAppointment(appointment.id);
      addNotification('success', 'Visit started. Patient chart active.');
      refresh();
    } catch (e) {
      addNotification('error', 'Could not start visit.');
    }
  };

  const handleCloseVisit = async () => {
    if (!diagnosis) return;
    setClosing(true);
    try {
      await clinicalService.closeAppointment(appointment.id, { diagnosis, notes, followUp });
      addNotification('success', 'Visit completed & summary generated.');
      setShowCloseModal(false);
      refresh();
    } catch (e) {
      addNotification('error', 'Failed to close visit.');
    } finally {
      setClosing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Lifecycle Actions */}
      <GlassCard className="flex justify-between items-center border-teal/20 bg-teal/5">
         <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
               {appointment.status === 'in_progress' ? (
                  <><span className="w-3 h-3 rounded-full bg-green-500 animate-pulse"/> In Progress</>
               ) : appointment.status === 'scheduled' ? (
                  <><Calendar className="text-teal"/> Scheduled</>
               ) : (
                  <><CheckCircle className="text-teal"/> Completed</>
               )}
            </h2>
            <p className="text-sm text-text-secondary">Patient: {appointment.patientId}</p>
         </div>
         
         <div>
            {appointment.status === 'scheduled' && (
               <Button onClick={handleStart} icon={<Play size={16}/>}>Start Visit</Button>
            )}
            {appointment.status === 'in_progress' && (
               <Button variant="secondary" onClick={() => setShowCloseModal(true)} icon={<CheckCircle size={16}/>}>
                  Finalize & Close
               </Button>
            )}
            {appointment.status === 'completed' && (
               <Badge color="teal">Summary Filed</Badge>
            )}
         </div>
      </GlassCard>

      {/* Clinical Workspace (Only if Started/Completed) */}
      {(appointment.status === 'in_progress' || appointment.status === 'completed') && (
        <div className="space-y-4">
           {/* Tab Navigation */}
           <div className="flex border-b border-white/10 overflow-x-auto">
              {[
                { key: 'overview', label: 'Overview' },
                { key: 'rx', label: 'Prescriptions' },
                { key: 'labs', label: 'Labs' },
                { key: 'notes', label: 'Notes' },
                { key: 'docs', label: 'Documents' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`
                    px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
                    ${activeTab === tab.key ? 'border-teal text-white' : 'border-transparent text-text-secondary hover:text-white'}
                  `}
                >
                  {tab.label}
                </button>
              ))}
           </div>
           
           <div className="min-h-[400px]">
              {patient ? (
                 <>
                   {activeTab === 'overview' && <OverviewTab />}
                   {activeTab === 'rx' && <PrescriptionsTab />}
                   {activeTab === 'labs' && <LabsTab />}
                   {activeTab === 'notes' && <NotesTab />}
                   {activeTab === 'docs' && <DocumentsTab />}
                 </>
              ) : <Loader text="Loading chart data..." />}
           </div>
        </div>
      )}

      {/* Close Modal */}
      <Modal isOpen={showCloseModal} onClose={() => setShowCloseModal(false)} title="Finalize Clinical Encounter">
         <div className="space-y-4">
            <div>
               <label className="text-xs text-text-secondary uppercase mb-1 block">Primary Diagnosis</label>
               <Input 
                 placeholder="e.g. Acute Bronchitis" 
                 value={diagnosis} 
                 onChange={e => setDiagnosis(e.target.value)}
               />
            </div>
            <div>
               <label className="text-xs text-text-secondary uppercase mb-1 block">Visit Summary Note</label>
               <textarea 
                  className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-teal min-h-[100px]"
                  placeholder="Summary of findings and treatment plan..."
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
               />
            </div>
            <div>
               <label className="text-xs text-text-secondary uppercase mb-1 block">Follow Up</label>
               <Input 
                 placeholder="e.g. 2 weeks" 
                 value={followUp} 
                 onChange={e => setFollowUp(e.target.value)}
               />
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
               <Button variant="outline" onClick={() => setShowCloseModal(false)}>Cancel</Button>
               <Button 
                 variant="primary" 
                 onClick={handleCloseVisit} 
                 disabled={!diagnosis || closing}
                 icon={closing ? <Loader text=""/> : <Save size={16}/>}
               >
                  {closing ? 'Closing...' : 'Sign & Close'}
               </Button>
            </div>
         </div>
      </Modal>
    </div>
  );
}

// Main Component
export const AppointmentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotification();
  
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Patient View State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [generatingAi, setGeneratingAi] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);

  const fetchAppointment = async () => {
    if (id) {
      const data = await appointmentService.getAppointmentById(id);
      setAppointment(data || null);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointment();
  }, [id]);

  const handlePatientCancel = async () => {
    if (!appointment) return;
    await appointmentService.updateStatus(appointment.id, 'cancelled');
    setAppointment({ ...appointment, status: 'cancelled' });
    setCancelModal(false);
    addNotification('info', 'Appointment cancelled.');
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

  // Render Doctor Workspace
  if (user?.role === 'doctor') {
     return (
        <ClinicalProvider>
           <div className="max-w-6xl mx-auto p-6 space-y-6 pb-20">
              <Button variant="outline" onClick={() => navigate('/dashboard')} icon={<ArrowLeft size={14} />} className="text-xs !py-2 !px-3">
                 Back to Dashboard
              </Button>
              <DoctorAppointmentView appointment={appointment} refresh={fetchAppointment} />
           </div>
        </ClinicalProvider>
     );
  }

  // Render Patient View
  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6 pb-20">
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
                 Visit with {appointment.doctorName}
               </h1>
               <Badge color={appointment.status === 'cancelled' ? 'purple' : 'teal'}>{appointment.status.replace('_', ' ').toUpperCase()}</Badge>
             </div>
             <p className="text-text-secondary text-sm flex items-center gap-2">
               <span className="font-mono text-teal">#{appointment.id}</span>
               <span>•</span>
               <span>{appointment.type === 'video' ? 'Telemedicine' : 'In-Person Visit'}</span>
             </p>
          </div>

          <div className="flex gap-3">
             {appointment.status === 'confirmed' && (
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
             {appointment.status === 'completed' && (
                 <Button variant="secondary" className="!py-2 text-sm" onClick={() => navigate(`/appointments/${appointment.id}/summary`)}>
                    View Summary
                 </Button>
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
                onClick={handlePatientCancel}
              >
                Confirm Cancellation
              </Button>
           </div>
        </div>
      </Modal>
    </div>
  );
};
