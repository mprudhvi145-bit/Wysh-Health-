import React, { useState, useEffect } from "react";
import { patientClinicalService } from "../services/patientClinicalService";
import { GlassCard, Loader, Badge, Button } from "../../../components/UI";
import { TestTube, ArrowLeft, Download, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PatientLabs: React.FC = () => {
  const [labs, setLabs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    patientClinicalService.getLabs()
      .then(res => setLabs(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Loading lab results..." /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <div>
           <Button variant="outline" className="text-xs !py-1 !px-2 mb-2" onClick={() => navigate('/dashboard')} icon={<ArrowLeft size={12}/>}>Dashboard</Button>
           <h1 className="text-2xl font-display font-bold text-white">Lab Results</h1>
           <p className="text-text-secondary text-sm">Diagnostic reports and orders.</p>
        </div>
      </div>

      <div className="space-y-4">
        {labs.length === 0 ? (
           <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
             <TestTube className="mx-auto text-text-secondary mb-4 opacity-50" size={48} />
             <p className="text-text-secondary">No lab orders found.</p>
           </div>
        ) : (
          labs.map(l => (
            <GlassCard key={l.id} className="flex flex-col md:flex-row items-center gap-6">
               <div className="flex-shrink-0 p-4 bg-purple/10 rounded-full text-purple">
                  <TestTube size={24} />
               </div>
               
               <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-bold text-white mb-1">{l.tests.join(", ")}</h3>
                  <p className="text-xs text-text-secondary mb-2">Ordered on {new Date(l.createdAt).toLocaleDateString()}</p>
                  <div className="flex items-center justify-center md:justify-start gap-2">
                     <Badge color={l.status === 'COMPLETED' ? 'teal' : 'purple'}>{l.status}</Badge>
                     {l.priority === 'Urgent' && <Badge color="purple">Urgent</Badge>}
                  </div>
               </div>

               <div className="flex-shrink-0">
                  {l.status === 'COMPLETED' ? (
                      <Button variant="outline" className="text-xs" icon={<Download size={14} />}>
                         Download Report
                      </Button>
                  ) : (
                      <span className="text-xs text-text-secondary italic">Processing...</span>
                  )}
               </div>
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};