
import React, { useEffect, useState } from 'react';
import { GlassCard, Button, Badge, Loader } from '../../components/UI';
import { Activity, Server, Database, Zap, RefreshCw, AlertTriangle, CheckCircle, ShieldCheck } from 'lucide-react';
import { api } from '../../services/api';

export const SystemHealth: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
      setLoading(true);
      try {
          const data = await api.get<any>('/admin/system');
          setStats(data);
      } catch (e) {
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      fetchStats();
      const interval = setInterval(fetchStats, 10000); // Auto refresh
      return () => clearInterval(interval);
  }, []);

  if (!stats && loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Diagnosing System..." /></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                    <Activity size={32} className="text-teal" /> System Health
                </h1>
                <p className="text-text-secondary text-sm">Real-time telemetry and reliability metrics.</p>
            </div>
            <Button variant="outline" onClick={fetchStats} icon={<RefreshCw size={16} className={loading ? "animate-spin" : ""}/>}>
                Refresh
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* API Performance */}
            <GlassCard>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Zap size={20} className="text-yellow-400" /> API Latency (p95)
                </h3>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">{stats?.metrics?.p95LatencyMs || 0}</span>
                    <span className="text-sm text-text-secondary mb-1">ms</span>
                </div>
                <div className="mt-4 flex gap-2 text-xs">
                    <Badge color="purple">Req: {stats?.metrics?.totalRequests}</Badge>
                    <Badge color={stats?.metrics?.errorRate > 0.01 ? 'purple' : 'teal'}>Err: {(stats?.metrics?.errorRate * 100).toFixed(2)}%</Badge>
                </div>
            </GlassCard>

            {/* Cache Stats */}
            <GlassCard>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <Database size={20} className="text-blue-400" /> Cache Efficiency
                </h3>
                <div className="flex items-end gap-2">
                    <span className="text-4xl font-bold text-white">{(stats?.cache?.hitRate * 100).toFixed(0)}</span>
                    <span className="text-sm text-text-secondary mb-1">% Hit Rate</span>
                </div>
                <div className="mt-4 flex gap-2 text-xs">
                    <Badge color="teal">Keys: {stats?.cache?.keys}</Badge>
                    <Badge color="purple">Misses: {stats?.cache?.misses}</Badge>
                </div>
            </GlassCard>

            {/* Circuit Breakers */}
            <GlassCard>
                <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck size={20} className="text-green-400" /> Resilience
                </h3>
                <div className="space-y-3">
                    {stats?.circuitBreakers?.map((cb: any) => (
                        <div key={cb.name} className="flex justify-between items-center bg-white/5 p-2 rounded">
                            <span className="text-sm text-white font-mono">{cb.name}</span>
                            {cb.state === 'CLOSED' ? (
                                <span className="flex items-center gap-1 text-xs text-green-400 font-bold"><CheckCircle size={12}/> OK</span>
                            ) : (
                                <span className="flex items-center gap-1 text-xs text-red-400 font-bold"><AlertTriangle size={12}/> {cb.state}</span>
                            )}
                        </div>
                    ))}
                    {(!stats?.circuitBreakers || stats.circuitBreakers.length === 0) && (
                        <p className="text-xs text-text-secondary">No active circuits.</p>
                    )}
                </div>
            </GlassCard>
        </div>

        <GlassCard className="bg-black/20 border-dashed border-white/10 text-center py-8">
            <Server className="mx-auto text-text-secondary mb-4 opacity-50" size={48} />
            <p className="text-text-secondary font-mono text-xs">
                Environment: {stats?.environment || 'UNKNOWN'} • Node: {stats?.metrics?.totalRequests} ops
            </p>
        </GlassCard>
    </div>
  );
};
