import React from 'react';
import { useClinical } from '../../hooks/useClinical';
import { Badge, GlassCard } from '../../../../components/UI';
import { AlertCircle, Activity, Thermometer, Heart, AlertTriangle, FileWarning } from 'lucide-react';

const OverviewTab: React.FC = () => {
  const { patient } = useClinical();

  if (!patient) return null;

  return (
    <div className="space-y-6">
      {/* Problem List (Pillar 2: Longitudinal Record) */}
      <GlassCard className="border-l-4 border-l-purple">
          <h4 className="text-white font-bold text-sm mb-4 flex items-center gap-2">
              <FileWarning size={16} className="text-purple" /> Active Problem List
          </h4>
          {patient.problems && patient.problems.length > 0 ? (
              <div className="space-y-2">
                  {patient.problems.map((prob: any) => (
                      <div key={prob.id} className="flex justify-between items-center p-2 bg-white/5 rounded border border-white/5">
                          <div>
                              <p className="text-white font-medium text-sm">{prob.diagnosis}</p>
                              <p className="text-[10px] text-text-secondary">Onset: {prob.onset}</p>
                          </div>
                          <Badge color="purple">{prob.status}</Badge>
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-xs text-text-secondary italic">No active problems recorded.</p>
          )}
      </GlassCard>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Alerts Column */}
        <div className="space-y-4">
          <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
            <h4 className="text-red-300 font-bold text-sm mb-3 flex items-center gap-2">
              <AlertCircle size={16} /> Allergies
            </h4>
            <div className="flex flex-wrap gap-2">
              {patient.allergies?.length > 0 ? (
                patient.allergies.map((a: string) => <Badge key={a} color="purple">{a}</Badge>)
              ) : (
                <span className="text-xs text-text-secondary">No Known Allergies</span>
              )}
            </div>
          </div>
          <div className="bg-teal/10 border border-teal/20 p-4 rounded-xl">
            <h4 className="text-teal font-bold text-sm mb-3 flex items-center gap-2">
              <Activity size={16} /> Chronic Conditions
            </h4>
            <div className="flex flex-wrap gap-2">
              {patient.chronicConditions?.length > 0 ? (
                patient.chronicConditions.map((c: string) => <Badge key={c} color="teal">{c}</Badge>)
              ) : (
                <span className="text-xs text-text-secondary">None Recorded</span>
              )}
            </div>
          </div>
        </div>

        {/* Vitals Column */}
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl h-full">
          <h4 className="text-white font-bold text-sm mb-4">Latest Vitals</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-text-secondary">Blood Pressure</span>
              <span className="text-white font-mono text-lg">120/80</span>
            </div>
            <div className="flex justify-between items-center text-sm border-b border-white/5 pb-2">
              <span className="text-text-secondary flex items-center gap-2"><Heart size={14} className="text-red-400"/> Heart Rate</span>
              <span className="text-white font-mono text-lg">72 <span className="text-xs text-text-secondary">bpm</span></span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-text-secondary flex items-center gap-2"><Thermometer size={14} className="text-blue-400"/> Temp</span>
              <span className="text-white font-mono text-lg">98.6 <span className="text-xs text-text-secondary">°F</span></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;