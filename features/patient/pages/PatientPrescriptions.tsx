import React, { useState, useEffect } from "react";
import { patientClinicalService } from "../services/patientClinicalService";
import { GlassCard, Loader, Badge, Button } from "../../../components/UI";
import { FileText, ArrowLeft, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const PatientPrescriptions: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    patientClinicalService.getPrescriptions()
      .then(res => setData(res))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Loading prescriptions..." /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center">
        <div>
           <Button variant="outline" className="text-xs !py-1 !px-2 mb-2" onClick={() => navigate('/dashboard')} icon={<ArrowLeft size={12}/>}>Dashboard</Button>
           <h1 className="text-2xl font-display font-bold text-white">My Prescriptions</h1>
           <p className="text-text-secondary text-sm">Active medications and history.</p>
        </div>
      </div>

      <div className="space-y-4">
        {data.length === 0 ? (
           <div className="text-center py-16 border border-dashed border-white/10 rounded-xl">
             <FileText className="mx-auto text-text-secondary mb-4 opacity-50" size={48} />
             <p className="text-text-secondary">No prescriptions found on record.</p>
           </div>
        ) : (
          data.map(rx => (
            <GlassCard key={rx.id} className="border-l-4 border-l-teal">
              <div className="flex justify-between items-start mb-4">
                 <div>
                    <div className="text-xs text-text-secondary flex items-center gap-2 mb-1">
                       <Clock size={12} /> {new Date(rx.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="text-lg font-bold text-white">Prescription #{rx.id.split('_')[1]}</h3>
                 </div>
                 <Badge color="teal">Active</Badge>
              </div>
              
              <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
                 <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-xs text-text-secondary uppercase">
                       <tr>
                          <th className="p-3">Medicine</th>
                          <th className="p-3">Dosage</th>
                          <th className="p-3">Frequency</th>
                          <th className="p-3">Duration</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {rx.items.map((i: any, idx: number) => (
                          <tr key={idx}>
                            <td className="p-3 font-medium text-white">{i.medicine}</td>
                            <td className="p-3 text-text-secondary">{i.dosage}</td>
                            <td className="p-3 text-text-secondary">{i.frequency}</td>
                            <td className="p-3 text-text-secondary">{i.duration}</td>
                          </tr>
                        ))}
                    </tbody>
                 </table>
              </div>

              {rx.notes && (
                 <div className="mt-4 p-3 bg-teal/5 rounded border border-teal/10 text-sm text-teal-glow">
                    <strong>Note:</strong> {rx.notes}
                 </div>
              )}
            </GlassCard>
          ))
        )}
      </div>
    </div>
  );
};