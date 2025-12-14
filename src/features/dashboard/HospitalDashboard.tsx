
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Loader } from '../../components/UI';
import { hospitalService, HospitalMetrics } from '../../services/hospitalService';
import { Building2, Users, Activity, Calendar } from 'lucide-react';

export const HospitalDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<HospitalMetrics | null>(null);

  useEffect(() => {
    hospitalService.getMetrics().then(setMetrics);
  }, []);

  if (!metrics) return <div className="h-full flex items-center justify-center"><Loader text="Loading Hospital Analytics..." /></div>;

  return (
    <div className="space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-display font-bold text-white">Hospital Command Center</h1>
                <p className="text-text-secondary text-sm">Real-time operational overview</p>
            </div>
            <Button variant="outline">Generate Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <GlassCard className="flex items-center gap-4">
                <div className="p-3 bg-teal/10 rounded-lg text-teal"><Users size={24}/></div>
                <div>
                    <h3 className="text-2xl font-bold text-white">{metrics.patients}</h3>
                    <p className="text-xs text-text-secondary">Total Patients</p>
                </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4">
                <div className="p-3 bg-purple/10 rounded-lg text-purple"><Calendar size={24}/></div>
                <div>
                    <h3 className="text-2xl font-bold text-white">{metrics.appointmentsToday}</h3>
                    <p className="text-xs text-text-secondary">Visits Today</p>
                </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400"><Activity size={24}/></div>
                <div>
                    <h3 className="text-2xl font-bold text-white">{metrics.activeDoctors}</h3>
                    <p className="text-xs text-text-secondary">Active Doctors</p>
                </div>
            </GlassCard>
            <GlassCard className="flex items-center gap-4">
                <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500"><Building2 size={24}/></div>
                <div>
                    <h3 className="text-2xl font-bold text-white">{metrics.occupancy}</h3>
                    <p className="text-xs text-text-secondary">Bed Occupancy</p>
                </div>
            </GlassCard>
        </div>

        {/* Placeholder for future features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="h-64 flex items-center justify-center border-dashed border-white/10">
                <p className="text-text-secondary">Department Performance Chart (Coming Soon)</p>
            </GlassCard>
            <GlassCard className="h-64 flex items-center justify-center border-dashed border-white/10">
                <p className="text-text-secondary">Revenue Analytics (Coming Soon)</p>
            </GlassCard>
        </div>
    </div>
  );
};
