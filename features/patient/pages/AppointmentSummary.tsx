import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { patientClinicalService } from "../services/patientClinicalService";
import { GlassCard, Loader, Button, Badge } from "../../../components/UI";
import { ArrowLeft, Calendar, User, Stethoscope, FileText, CheckCircle } from "lucide-react";

export const AppointmentSummary: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    patientClinicalService.getAppointmentSummary(id)
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Loading visit summary..." /></div>;
  if (!data) return <div className="p-8 text-center text-white">Summary not available.</div>;

  const { summary } = data;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Button variant="outline" onClick={() => navigate('/appointments')} icon={<ArrowLeft size={14} />} className="text-xs !py-2 !px-3">
        Back to Appointments
      </Button>

      <GlassCard className="text-center py-8">
         <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
            <CheckCircle className="text-green-500" size={32} />
         </div>
         <h1 className="text-2xl font-display font-bold text-white mb-2">Visit Completed</h1>
         <p className="text-text-secondary">Reference ID: {data.id}</p>
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <GlassCard>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <Calendar size={18} className="text-teal" /> Visit Details
            </h3>
            <div className="space-y-3 text-sm">
               <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-text-secondary">Date</span>
                  <span className="text-white">{new Date(data.scheduledAt).toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between py-2 border-b border-white/5">
                  <span className="text-text-secondary">Doctor</span>
                  <span className="text-white">{data.doctorName}</span>
               </div>
               <div className="flex justify-between py-2">
                   <span className="text-text-secondary">Type</span>
                   <span className="capitalize text-white">{data.type} Consult</span>
               </div>
            </div>
         </GlassCard>

         <GlassCard>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <Stethoscope size={18} className="text-purple" /> Clinical Outcome
            </h3>
            {summary ? (
               <div className="space-y-4">
                  <div>
                     <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Diagnosis</label>
                     <p className="text-white font-medium">{summary.diagnosis}</p>
                  </div>
                  <div>
                     <label className="text-xs text-text-secondary uppercase tracking-wider block mb-1">Follow Up</label>
                     <p className="text-teal">{summary.followUp || 'As needed'}</p>
                  </div>
               </div>
            ) : (
               <p className="text-text-secondary text-sm italic">No clinical summary recorded for this visit.</p>
            )}
         </GlassCard>
      </div>

      {summary && summary.notes && (
         <GlassCard>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
               <FileText size={18} className="text-text-secondary" /> Doctor's Notes
            </h3>
            <div className="p-4 bg-white/5 rounded-lg border border-white/5 text-sm text-text-secondary leading-relaxed">
               {summary.notes}
            </div>
         </GlassCard>
      )}
    </div>
  );
};