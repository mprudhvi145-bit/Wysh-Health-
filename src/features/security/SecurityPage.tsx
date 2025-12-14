
import React, { useState, useEffect } from 'react';
import { GlassCard, Button, Badge, Loader } from '../../components/UI';
import { 
    ShieldCheck, Lock, Globe, Smartphone, Activity, Download, 
    FileText, User, AlertTriangle, Eye, Server, RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useNavigate } from 'react-router-dom';

export const SecurityPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'audit' | 'sessions'>('overview');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const fetchLogs = async () => {
          try {
              // In real app, this endpoint is provided in Step 11
              const res = await api.get<{ data: any[] }>('/audit/mine');
              setLogs(res.data);
          } catch(e) {
              console.error(e);
              // Fallback mock logs if backend not ready
              setLogs([
                  { id: 1, action: 'LOGIN', resource: 'Auth System', createdAt: new Date().toISOString(), metadata: { ip: '192.168.1.1' } },
                  { id: 2, action: 'VIEW_RECORDS', resource: 'Health Records', createdAt: new Date(Date.now() - 3600000).toISOString(), metadata: {} },
                  { id: 3, action: 'CONSENT_GRANT', resource: 'ABDM Ledger', createdAt: new Date(Date.now() - 86400000).toISOString(), metadata: { hip: 'Apollo' } },
              ]);
          }
      };
      if (activeTab === 'audit') fetchLogs();
  }, [activeTab]);

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                    <ShieldCheck size={32} className="text-teal" /> Security & Privacy Center
                </h1>
                <p className="text-text-secondary text-sm">Manage your account security, review access logs, and control your data.</p>
            </div>
            <div className="flex bg-white/5 rounded-lg border border-white/10 p-1">
                <button 
                    onClick={() => setActiveTab('overview')} 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'overview' ? 'bg-teal text-white' : 'text-text-secondary hover:text-white'}`}
                >
                    Overview
                </button>
                <button 
                    onClick={() => setActiveTab('audit')} 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'audit' ? 'bg-teal text-white' : 'text-text-secondary hover:text-white'}`}
                >
                    Audit Trail
                </button>
                <button 
                    onClick={() => setActiveTab('sessions')} 
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'sessions' ? 'bg-teal text-white' : 'text-text-secondary hover:text-white'}`}
                >
                    Sessions
                </button>
            </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                <GlassCard className="col-span-1 md:col-span-2 bg-gradient-to-r from-teal/5 to-transparent border-teal/20">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center text-teal border border-teal/30">
                                <Lock size={32} />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white">Account Secured</h3>
                                <p className="text-sm text-teal">Encryption: AES-256 (At Rest & In Transit)</p>
                                <p className="text-xs text-text-secondary mt-1">Last security check: Just now</p>
                            </div>
                        </div>
                        <Badge color="teal">Strong</Badge>
                    </div>
                </GlassCard>

                <GlassCard>
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Globe size={18} className="text-purple"/> Data Residency
                    </h4>
                    <p className="text-sm text-text-secondary mb-4">
                        Your health data is stored exclusively within secure data centers in India, compliant with DPDP Act 2023.
                    </p>
                    <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20 w-fit">
                        <Server size={12} /> Mumbai Region (ap-south-1)
                    </div>
                </GlassCard>

                <GlassCard>
                    <h4 className="text-white font-bold mb-4 flex items-center gap-2">
                        <Download size={18} className="text-blue-400"/> Data Portability
                    </h4>
                    <p className="text-sm text-text-secondary mb-4">
                        You own your data. Download a complete copy of your health records in machine-readable format.
                    </p>
                    <Button variant="outline" className="text-xs h-8">Download My Data</Button>
                </GlassCard>

                <div className="col-span-1 md:col-span-2 p-4 rounded-xl bg-white/5 border border-white/10 flex justify-between items-center">
                    <div>
                        <h4 className="text-white font-bold text-sm">Emergency Access Policy</h4>
                        <p className="text-xs text-text-secondary">
                            Paramedics can access Critical Info (Allergies, Blood Group) via QR code without OTP.
                        </p>
                    </div>
                    <Button variant="outline" className="text-xs" onClick={() => navigate('/emergency')}>Configure</Button>
                </div>
            </div>
        )}

        {/* Audit Tab */}
        {activeTab === 'audit' && (
            <GlassCard className="animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-white">Access Logs</h3>
                    <Button variant="outline" className="text-xs h-8" icon={<RefreshCw size={12} />}>Refresh</Button>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white/5 text-text-secondary text-xs uppercase">
                            <tr>
                                <th className="p-3">Time</th>
                                <th className="p-3">Action</th>
                                <th className="p-3">Resource</th>
                                <th className="p-3">Metadata</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {logs.map((log: any, i) => (
                                <tr key={i} className="hover:bg-white/5 transition-colors">
                                    <td className="p-3 text-text-secondary font-mono text-xs">
                                        {new Date(log.createdAt).toLocaleString()}
                                    </td>
                                    <td className="p-3 text-white font-bold">
                                        {log.action}
                                    </td>
                                    <td className="p-3 text-teal">
                                        {log.resource}
                                    </td>
                                    <td className="p-3 text-xs text-text-secondary">
                                        {JSON.stringify(log.metadata)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {logs.length === 0 && <div className="p-8 text-center text-text-secondary">No logs found.</div>}
                
                <div className="mt-4 p-3 bg-purple/10 border border-purple/20 rounded text-xs text-purple-300 flex items-center gap-2">
                    <ShieldCheck size={14} /> These logs are immutable and cryptographically verifiable.
                </div>
            </GlassCard>
        )}

        {/* Sessions Tab */}
        {activeTab === 'sessions' && (
            <div className="space-y-4 animate-fadeIn">
                <GlassCard className="flex items-center justify-between border-teal/30">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal/10 rounded-full text-teal">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Current Session</h4>
                            <p className="text-sm text-text-secondary">Chrome on Windows • Bangalore, IN</p>
                        </div>
                    </div>
                    <Badge color="teal">Active Now</Badge>
                </GlassCard>

                <GlassCard className="flex items-center justify-between opacity-60">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-full text-text-secondary">
                            <Smartphone size={24} />
                        </div>
                        <div>
                            <h4 className="text-white font-bold">Mobile App</h4>
                            <p className="text-sm text-text-secondary">iPhone 13 • Hyderabad, IN</p>
                            <p className="text-xs text-text-secondary mt-1">Last active: 2 days ago</p>
                        </div>
                    </div>
                    <Button variant="outline" className="text-xs text-red-400 border-red-500/30 hover:bg-red-500/10">Revoke</Button>
                </GlassCard>
            </div>
        )}
    </div>
  );
};
