
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Badge, Loader, Modal, Input } from '../../components/UI';
import { 
    Activity, Server, Database, Zap, RefreshCw, AlertTriangle, CheckCircle, 
    ShieldCheck, Lock, Eye, AlertOctagon, TrendingUp, FileWarning, Siren, ShieldAlert
} from 'lucide-react';
import { adminService, OpsMetrics } from '../../services/adminService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useNotification } from '../../context/NotificationContext';

export const SystemHealth: React.FC = () => {
  const { addNotification } = useNotification();
  const [metrics, setMetrics] = useState<OpsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ops' | 'consent' | 'emergency' | 'clinical'>('ops');
  
  // Incident Response State
  const [killModalOpen, setKillModalOpen] = useState(false);
  const [killTarget, setKillTarget] = useState<'SHARING' | 'EMERGENCY' | 'ACCOUNT' | null>(null);
  const [targetId, setTargetId] = useState('');

  const fetchStats = async () => {
      // Background refresh shouldn't trigger full loader
      try {
          const data = await adminService.getOpsMetrics();
          setMetrics(data);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchStats();
      const interval = setInterval(fetchStats, 5000); // 5s "Live" pulse
      return () => clearInterval(interval);
  }, []);

  const handleKillSwitch = async () => {
      if (!killTarget) return;
      try {
          await adminService.triggerKillSwitch(killTarget, targetId);
          addNotification('error', `ACTION EXECUTED: ${killTarget} DISABLED/LOCKED.`);
          setKillModalOpen(false);
          setTargetId('');
      } catch (e) {
          addNotification('error', 'Action failed to execute.');
      }
  };

  const openKillModal = (target: 'SHARING' | 'EMERGENCY' | 'ACCOUNT') => {
      setKillTarget(target);
      setKillModalOpen(true);
  };

  if (!metrics && loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Initializing Control Center..." /></div>;

  const COLORS = ['#4D8B83', '#EF4444', '#FFBB28'];

  return (
    <div className="max-w-[1600px] mx-auto px-6 py-8 space-y-6">
        {/* Command Header */}
        <div className="flex justify-between items-center bg-black/40 p-4 rounded-xl border border-white/10 backdrop-blur-md sticky top-20 z-40">
            <div className="flex items-center gap-4">
                <div className="p-2 bg-red-500/20 rounded border border-red-500/50 animate-pulse-slow">
                    <Activity size={24} className="text-red-500" />
                </div>
                <div>
                    <h1 className="text-xl font-display font-bold text-white flex items-center gap-2">
                        PILOT OPERATIONS CONTROL <Badge color="red">LIVE</Badge>
                    </h1>
                    <p className="text-text-secondary text-xs font-mono tracking-widest uppercase">
                        System Integrity: {metrics?.system.uptime}% • Active Nodes: 3 • Region: AP-SOUTH-1
                    </p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button 
                    variant="outline" 
                    className={`text-xs ${activeTab === 'ops' ? 'bg-white/10 text-white' : 'text-text-secondary'}`}
                    onClick={() => setActiveTab('ops')}
                >
                    Ops Health
                </Button>
                <Button 
                    variant="outline" 
                    className={`text-xs ${activeTab === 'consent' ? 'bg-white/10 text-white' : 'text-text-secondary'}`}
                    onClick={() => setActiveTab('consent')}
                >
                    Consent Monitor
                </Button>
                <Button 
                    variant="outline" 
                    className={`text-xs ${activeTab === 'emergency' ? 'bg-white/10 text-white' : 'text-text-secondary'}`}
                    onClick={() => setActiveTab('emergency')}
                >
                    Emergency Watch
                </Button>
                <Button 
                    variant="danger" 
                    className="ml-4 text-xs font-bold animate-pulse" 
                    icon={<AlertOctagon size={14}/>}
                    onClick={() => openKillModal('ACCOUNT')}
                >
                    INCIDENT RESPONSE
                </Button>
            </div>
        </div>

        {/* OPS HEALTH DASHBOARD */}
        {activeTab === 'ops' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-fadeIn">
                <GlassCard className="p-4 border-l-4 border-l-teal">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-text-secondary uppercase font-bold">API Latency (p95)</p>
                            <h3 className="text-2xl font-mono text-white mt-1">{metrics?.system.latency}ms</h3>
                        </div>
                        <Zap size={16} className="text-teal" />
                    </div>
                    <div className="w-full bg-white/10 h-1 mt-3 rounded-full overflow-hidden">
                        <div className="bg-teal h-full transition-all duration-500" style={{ width: `${Math.min(100, (metrics?.system.latency || 0) / 2)}%` }} />
                    </div>
                </GlassCard>

                <GlassCard className="p-4 border-l-4 border-l-purple">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-text-secondary uppercase font-bold">Error Rate</p>
                            <h3 className={`text-2xl font-mono mt-1 ${(metrics?.system.errorRate || 0) > 1 ? 'text-red-400' : 'text-white'}`}>
                                {metrics?.system.errorRate}%
                            </h3>
                        </div>
                        <AlertTriangle size={16} className="text-purple" />
                    </div>
                    <p className="text-[10px] text-text-secondary mt-3">Threshold: 2.0%</p>
                </GlassCard>

                <GlassCard className="p-4 border-l-4 border-l-green-500">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-text-secondary uppercase font-bold">OTP Success</p>
                            <h3 className="text-2xl font-mono text-white mt-1">{metrics?.system.otpSuccess}%</h3>
                        </div>
                        <CheckCircle size={16} className="text-green-500" />
                    </div>
                    <p className="text-[10px] text-text-secondary mt-3">SMS Gateway: Healthy</p>
                </GlassCard>

                <GlassCard className="p-4 border-l-4 border-l-blue-400">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-text-secondary uppercase font-bold">Active Users</p>
                            <h3 className="text-2xl font-mono text-white mt-1">{metrics?.usage.activeDoctors + (metrics?.usage.activePatients || 0)}</h3>
                        </div>
                        <Server size={16} className="text-blue-400" />
                    </div>
                    <p className="text-[10px] text-text-secondary mt-3">Doctors: {metrics?.usage.activeDoctors} • Patients: {metrics?.usage.activePatients}</p>
                </GlassCard>

                {/* Live Graph Placeholder */}
                <div className="md:col-span-2 h-64 bg-black/20 rounded-xl border border-white/5 p-4 relative overflow-hidden">
                    <p className="text-xs text-text-secondary uppercase font-bold absolute top-4 left-4">Traffic Ingress (Last 1h)</p>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={[
                            {t: '10:00', v: 40}, {t: '10:05', v: 30}, {t: '10:10', v: 50}, 
                            {t: '10:15', v: 45}, {t: '10:20', v: 80}, {t: '10:25', v: 55},
                            {t: '10:30', v: 60}, {t: '10:35', v: 65}, {t: '10:40', v: 50}
                        ]}>
                            <defs>
                                <linearGradient id="colorTraffic" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#4D8B83" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#4D8B83" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <Area type="monotone" dataKey="v" stroke="#4D8B83" fillOpacity={1} fill="url(#colorTraffic)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                <div className="md:col-span-2 h-64 bg-black/20 rounded-xl border border-white/5 p-4 overflow-y-auto">
                    <p className="text-xs text-text-secondary uppercase font-bold mb-3">System Alerts</p>
                    <div className="space-y-2">
                        <div className="flex gap-3 text-xs p-2 bg-white/5 rounded border border-white/5">
                            <span className="text-teal font-mono">10:42:12</span>
                            <span className="text-white">New Doctor Login (ID: 9921)</span>
                        </div>
                        <div className="flex gap-3 text-xs p-2 bg-white/5 rounded border border-white/5">
                            <span className="text-teal font-mono">10:40:05</span>
                            <span className="text-white">Consent Granted (Req: C-129)</span>
                        </div>
                        <div className="flex gap-3 text-xs p-2 bg-yellow-500/10 rounded border border-yellow-500/20 text-yellow-200">
                            <span className="font-mono">10:15:00</span>
                            <span>High Latency Warning (AI Service)</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* CONSENT MONITOR */}
        {activeTab === 'consent' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
                <GlassCard className="col-span-1">
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                        <ShieldCheck size={20} className="text-purple"/> Approval Rates
                    </h3>
                    <div className="h-48 w-full flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie 
                                    data={[
                                        { name: 'Approved', value: metrics?.consent.approved },
                                        { name: 'Denied', value: metrics?.consent.denied },
                                        { name: 'Pending', value: (metrics?.consent.totalRequests || 0) - (metrics?.consent.approved || 0) - (metrics?.consent.denied || 0) }
                                    ]} 
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value"
                                >
                                    {COLORS.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #333'}}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-4 text-xs">
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#4D8B83]"/> Approved</div>
                        <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-[#EF4444]"/> Denied</div>
                    </div>
                </GlassCard>

                <div className="col-span-2 space-y-4">
                    {/* Violations - CRITICAL */}
                    <div className={`p-4 rounded-xl border ${metrics?.consent.violations ? 'bg-red-500/20 border-red-500 animate-pulse' : 'bg-green-500/5 border-green-500/20'}`}>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                {metrics?.consent.violations ? <ShieldAlert size={24} className="text-red-500"/> : <ShieldCheck size={24} className="text-green-500"/>}
                                <div>
                                    <h3 className={`font-bold ${metrics?.consent.violations ? 'text-red-400' : 'text-green-400'}`}>
                                        {metrics?.consent.violations ? 'ACTIVE VIOLATIONS DETECTED' : 'Consent Integrity Secure'}
                                    </h3>
                                    <p className="text-xs text-text-secondary">
                                        {metrics?.consent.violations} attempts to access records without valid token.
                                    </p>
                                </div>
                            </div>
                            {metrics?.consent.violations ? (
                                <Button variant="danger" className="text-xs h-8" onClick={() => openKillModal('ACCOUNT')}>Block Actor</Button>
                            ) : null}
                        </div>
                    </div>

                    <GlassCard>
                        <h4 className="text-white font-bold text-sm mb-3">Recent Denials (Potential Friction)</h4>
                        <div className="space-y-2">
                            {[1, 2].map(i => (
                                <div key={i} className="flex justify-between items-center p-2 bg-white/5 rounded text-xs">
                                    <span className="text-white">Patient P-10{i} denied Dr. Chen</span>
                                    <span className="text-text-secondary">Reason: "Did not request"</span>
                                </div>
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        )}

        {/* EMERGENCY MONITOR */}
        {activeTab === 'emergency' && (
            <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="col-span-2">
                        <GlassCard className="h-full">
                            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                                <Siren size={20} className="text-red-500 animate-pulse"/> Emergency Access Log
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-xs">
                                    <thead className="text-text-secondary border-b border-white/10">
                                        <tr>
                                            <th className="p-3">Time</th>
                                            <th className="p-3">Target ID</th>
                                            <th className="p-3">Location (IP)</th>
                                            <th className="p-3">Duration</th>
                                            <th className="p-3">Status</th>
                                            <th className="p-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {metrics?.emergency.map((evt, i) => (
                                            <tr key={i} className="hover:bg-white/5">
                                                <td className="p-3 font-mono text-text-secondary">{new Date(evt.timestamp).toLocaleTimeString()}</td>
                                                <td className="p-3 text-white font-bold">{evt.wyshId}</td>
                                                <td className="p-3 text-text-secondary">{evt.location}</td>
                                                <td className="p-3 text-white">{evt.duration}</td>
                                                <td className="p-3">
                                                    <span className={`px-2 py-1 rounded ${evt.status === 'Safe' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                                        {evt.status}
                                                    </span>
                                                </td>
                                                <td className="p-3">
                                                    <Button variant="outline" className="text-[10px] h-6 px-2">Investigate</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </GlassCard>
                    </div>
                    <div className="space-y-4">
                        <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-center">
                            <Lock size={32} className="mx-auto text-red-400 mb-2" />
                            <h3 className="text-white font-bold">Lockdown Mode</h3>
                            <p className="text-xs text-red-200/70 mb-4">
                                Disable all public emergency QR access globally. Use only in event of massive data breach.
                            </p>
                            <Button variant="danger" className="w-full justify-center" onClick={() => openKillModal('EMERGENCY')}>
                                DISABLE EMERGENCY ACCESS
                            </Button>
                        </div>
                        <GlassCard>
                            <h4 className="text-white font-bold text-sm mb-2">Policy Check</h4>
                            <ul className="text-xs text-text-secondary space-y-2">
                                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-teal"/> Access Notification Sent</li>
                                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-teal"/> IP Logged Immutable</li>
                                <li className="flex items-center gap-2"><CheckCircle size={12} className="text-teal"/> Duration Cap Active (20m)</li>
                            </ul>
                        </GlassCard>
                    </div>
                </div>
            </div>
        )}

        {/* INCIDENT RESPONSE MODAL */}
        <Modal isOpen={killModalOpen} onClose={() => setKillModalOpen(false)} title="CRITICAL ACTION CONFIRMATION">
            <div className="space-y-4">
                <div className="p-4 bg-red-500/20 border border-red-500 rounded text-red-100 flex items-start gap-3">
                    <AlertTriangle size={24} className="flex-shrink-0 animate-pulse" />
                    <div>
                        <h3 className="font-bold text-lg">WARNING: DESTRUCTIVE ACTION</h3>
                        <p className="text-sm mt-1">
                            You are about to trigger a kill-switch for: <strong>{killTarget}</strong>.
                            This will immediately block access and may disrupt ongoing clinical care.
                        </p>
                    </div>
                </div>

                <div>
                    <label className="text-xs text-text-secondary uppercase mb-2 block">Confirm Target ID (Optional - Leave blank for Global)</label>
                    <Input 
                        placeholder="Enter User ID / Hospital ID..." 
                        value={targetId}
                        onChange={e => setTargetId(e.target.value)}
                        className="border-red-500/50 focus:border-red-500"
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                    <Button variant="outline" onClick={() => setKillModalOpen(false)}>Cancel</Button>
                    <Button 
                        variant="danger" 
                        onClick={handleKillSwitch}
                        icon={<Lock size={16}/>}
                    >
                        CONFIRM LOCKDOWN
                    </Button>
                </div>
            </div>
        </Modal>
    </div>
  );
};
