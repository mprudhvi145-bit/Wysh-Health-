
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Loader, Badge } from '../../components/UI';
import { hospitalService, HospitalMetrics } from '../../services/hospitalService';
import { Building2, Users, Activity, Calendar, TrendingUp, AlertTriangle, Database } from 'lucide-react';
import { RoleLayout } from '../../components/RoleLayout';
import { getDensity } from '../../utils/uiDensity';

export const HospitalDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<HospitalMetrics | null>(null);
  const density = getDensity('hospital');

  useEffect(() => {
    hospitalService.getMetrics().then(setMetrics);
  }, []);

  if (!metrics) return <div className="h-full flex items-center justify-center"><Loader text="Loading Analytics..." /></div>;

  return (
    <RoleLayout role="hospital">
        <div className="flex justify-between items-center py-2 border-b border-white/10">
            <div className="flex items-center gap-3">
                <div className="p-1.5 bg-white/10 rounded border border-white/10">
                    <Database size={16} className="text-white"/>
                </div>
                <div>
                    <h1 className={density.heading}>Hospital Command Center</h1>
                    <p className={density.subheading}>System Status: <span className="text-green-400">Operational</span> • Load: 42%</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button variant="outline" className={density.buttonSize}>Download Logs</Button>
                <Button variant="primary" className={density.buttonSize}>Gen Report</Button>
            </div>
        </div>

        {/* Dense Metric Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
            <GlassCard className="p-2 flex flex-col justify-between h-20 bg-teal/5 border-teal/20">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-teal uppercase font-bold">Total Patients</span>
                    <Users size={14} className="text-teal opacity-50"/>
                </div>
                <h3 className="text-xl font-mono text-white leading-none">{metrics.patients}</h3>
            </GlassCard>
            
            <GlassCard className="p-2 flex flex-col justify-between h-20 bg-purple/5 border-purple/20">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-purple uppercase font-bold">OPD Today</span>
                    <Calendar size={14} className="text-purple opacity-50"/>
                </div>
                <h3 className="text-xl font-mono text-white leading-none">{metrics.appointmentsToday}</h3>
            </GlassCard>

            <GlassCard className="p-2 flex flex-col justify-between h-20 bg-blue-500/5 border-blue-500/20">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-blue-400 uppercase font-bold">Active Staff</span>
                    <Activity size={14} className="text-blue-400 opacity-50"/>
                </div>
                <h3 className="text-xl font-mono text-white leading-none">{metrics.activeDoctors}</h3>
            </GlassCard>

            <GlassCard className="p-2 flex flex-col justify-between h-20 bg-orange-500/5 border-orange-500/20">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-orange-500 uppercase font-bold">Occupancy</span>
                    <Building2 size={14} className="text-orange-500 opacity-50"/>
                </div>
                <h3 className="text-xl font-mono text-white leading-none">{metrics.occupancy}</h3>
            </GlassCard>

            <GlassCard className="p-2 flex flex-col justify-between h-20 border-white/10">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-text-secondary uppercase font-bold">Revenue (Est)</span>
                    <TrendingUp size={14} className="text-text-secondary opacity-50"/>
                </div>
                <h3 className="text-lg font-mono text-white leading-none">₹4.2L</h3>
            </GlassCard>

            <GlassCard className="p-2 flex flex-col justify-between h-20 border-white/10">
                <div className="flex justify-between items-start">
                    <span className="text-[10px] text-text-secondary uppercase font-bold">Pending Tasks</span>
                    <AlertTriangle size={14} className="text-text-secondary opacity-50"/>
                </div>
                <h3 className="text-lg font-mono text-white leading-none">12</h3>
            </GlassCard>
        </div>

        {/* Tabular Data Area - High Density */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[calc(100vh-220px)] min-h-[400px]">
            <GlassCard className="p-0 overflow-hidden flex flex-col">
                <div className="p-2 bg-white/5 border-b border-white/10 flex justify-between items-center">
                    <h4 className={density.heading}>Department Performance</h4>
                    <Badge color="teal">Real-time</Badge>
                </div>
                <div className="flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-black/30 sticky top-0">
                            <tr>
                                <th className="p-2 text-[10px] text-text-secondary uppercase">Dept</th>
                                <th className="p-2 text-[10px] text-text-secondary uppercase">Load</th>
                                <th className="p-2 text-[10px] text-text-secondary uppercase">Wait Time</th>
                                <th className="p-2 text-[10px] text-text-secondary uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-[11px] text-text-secondary divide-y divide-white/5">
                            {['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Oncology', 'Emergency'].map((dept, i) => (
                                <tr key={dept} className="hover:bg-white/5">
                                    <td className="p-2 text-white font-medium">{dept}</td>
                                    <td className="p-2">{40 + i * 5}%</td>
                                    <td className="p-2">{10 + i * 2} min</td>
                                    <td className="p-2">
                                        <span className={`px-1.5 py-0.5 rounded ${i === 5 ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                                            {i === 5 ? 'Critical' : 'Normal'}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>

            <GlassCard className="p-0 overflow-hidden flex flex-col">
                <div className="p-2 bg-white/5 border-b border-white/10 flex justify-between items-center">
                    <h4 className={density.heading}>System Audit Log</h4>
                    <Button variant="outline" className={density.buttonSize}>Filter</Button>
                </div>
                <div className="flex-1 overflow-auto bg-black/20">
                    <div className="divide-y divide-white/5 font-mono">
                        {[...Array(15)].map((_, i) => (
                            <div key={i} className="flex gap-2 p-1.5 hover:bg-white/5 text-[10px]">
                                <span className="text-teal opacity-70">10:4{i}:22</span>
                                <span className="text-purple font-bold">AUTH</span>
                                <span className="text-text-secondary">User doctor_{i} logged in from IP 192.168.1.{i+20}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </GlassCard>
        </div>
    </RoleLayout>
  );
};
