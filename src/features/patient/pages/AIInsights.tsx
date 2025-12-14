
import React, { useState, useEffect } from 'react';
import { api } from '../../../services/api';
import { GlassCard, Button, Badge, Loader, Modal } from '../../../components/UI';
import { Brain, FileText, ArrowLeft, ShieldCheck, AlertCircle, Heart, Zap, Activity, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

export const AIInsights: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPolicy, setShowPolicy] = useState(false);

  useEffect(() => {
    const fetchOverview = async () => {
        if(user) {
            try {
                const res = await api.get<any>('/ai/health/overview');
                setOverview(res);
            } catch (e) {
                console.error("Failed to load AI overview", e);
            }
        }
        setLoading(false);
    };
    fetchOverview();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Analyzing Clinical Data..." /></div>;

  const scoreData = overview ? [
      { subject: 'Physical', A: overview.subscores.physical, fullMark: 100 },
      { subject: 'Mental', A: overview.subscores.mental, fullMark: 100 },
      { subject: 'Lifestyle', A: overview.subscores.lifestyle, fullMark: 100 },
  ] : [];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
                 <Button variant="outline" className="text-xs !py-1 !px-2 mb-2" onClick={() => navigate('/dashboard')} icon={<ArrowLeft size={12}/>}>Dashboard</Button>
                 <h1 className="text-3xl font-display font-bold text-white">Health Intelligence</h1>
                 <p className="text-text-secondary text-sm">Powered by Wysh AI Engine v2.5</p>
            </div>
            <div className="flex items-center gap-4">
                <Button variant="outline" className="text-xs h-8" onClick={() => setShowPolicy(true)} icon={<Info size={12}/>}>
                    AI Governance Policy
                </Button>
                {overview && (
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-xs text-text-secondary uppercase tracking-wider">Overall Score</p>
                            <p className="text-2xl font-bold text-teal-glow">{overview.healthScore}/100</p>
                        </div>
                        <div className="w-12 h-12 rounded-full border-4 border-teal flex items-center justify-center bg-teal/10 text-white font-bold">
                            {overview.healthScore}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {!overview ? (
             <div className="text-center py-20 border border-dashed border-white/10 rounded-xl">
                 <Brain className="mx-auto text-text-secondary mb-4 opacity-50" size={48} />
                 <p className="text-text-secondary">Insufficient data for AI analysis.</p>
                 <Button variant="outline" className="mt-4" onClick={() => navigate('/dashboard/records')}>Upload Records</Button>
             </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Score Chart */}
                <GlassCard className="col-span-1 flex flex-col items-center justify-center">
                    <h3 className="text-white font-bold mb-4">Wellness Balance</h3>
                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={scoreData}>
                                <PolarGrid stroke="#333" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9BA5AD', fontSize: 12 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar name="Score" dataKey="A" stroke="#4D8B83" strokeWidth={2} fill="#4D8B83" fillOpacity={0.4} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-xs text-text-secondary mt-2 text-center">Based on vitals, history, and activity</p>
                </GlassCard>

                {/* Risk Assessment */}
                <GlassCard className="col-span-1 md:col-span-2">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-purple"/> Risk Assessment
                    </h3>
                    <div className="space-y-4">
                        {overview.risks.map((risk: any, i: number) => (
                            <div key={i} className="flex items-start gap-4 p-4 bg-white/5 border border-white/5 rounded-xl">
                                <div className={`p-2 rounded-full mt-1 ${risk.level === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                    <AlertCircle size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold text-sm">{risk.risk}</h4>
                                    <Badge color={risk.level === 'High' ? 'purple' : 'teal'}>{risk.level} Risk</Badge>
                                    <p className="text-text-secondary text-sm mt-2">{risk.advice}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Preventive Care */}
                <GlassCard className="col-span-1 md:col-span-3">
                    <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                        <ShieldCheck size={18} className="text-teal"/> Preventive Care Plan
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {overview.preventiveCare.map((item: any, i: number) => (
                            <div key={i} className="p-4 bg-black/20 border border-white/5 rounded-lg flex flex-col justify-between h-full">
                                <div>
                                    <h4 className="text-white font-medium text-sm mb-1">{item.action}</h4>
                                    <p className="text-xs text-text-secondary">Recommended based on profile</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-xs text-teal font-bold">{item.due}</span>
                                    <Button variant="outline" className="text-[10px] h-6 px-2">Schedule</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </GlassCard>

            </div>
        )}
        
        {/* Disclaimer */}
        <div className="p-4 bg-white/5 rounded-lg border border-white/10 flex items-start gap-3">
             <AlertCircle className="text-text-secondary flex-shrink-0" size={16} />
             <p className="text-xs text-text-secondary leading-relaxed">
                <strong>AI Disclaimer:</strong> Insights generated by Wysh AI are for informational purposes only and do not constitute a medical diagnosis. 
                Always verify with a certified healthcare professional.
             </p>
        </div>

        {/* Governance Modal */}
        <Modal isOpen={showPolicy} onClose={() => setShowPolicy(false)} title="AI Governance">
            <div className="space-y-4">
                <div className="p-4 bg-teal/10 border border-teal/20 rounded-lg text-sm text-white">
                    Wysh Care employs artificial intelligence solely as a <strong>Clinical Decision Support System (CDSS)</strong>.
                </div>
                <ul className="list-disc pl-5 text-text-secondary text-sm space-y-2">
                    <li>AI does not autonomously diagnose or prescribe.</li>
                    <li>All outputs are probabilistic and require human verification.</li>
                    <li>Data used for inference is ephemeral and not used to train global models without anonymized consent.</li>
                </ul>
                <div className="flex justify-end pt-4">
                    <Button onClick={() => setShowPolicy(false)}>Acknowledge</Button>
                </div>
            </div>
        </Modal>
    </div>
  );
};
