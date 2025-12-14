
import React from 'react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { Brain, FileText, AlertTriangle, ShieldCheck, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AIClinicalProduct: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
            <Button variant="outline" onClick={() => navigate('/products')} className="mb-4 text-xs !py-1 !px-3">Back to Platform</Button>
            <Badge color="purple">Gemini 2.5 Powered</Badge>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
                AI Clinical Insights
            </h1>
            <p className="text-xl text-teal-glow">
                Reduce cognitive load. Never replace judgment.
            </p>
            <p className="text-text-secondary">
                Wysh Care uses AI as an assistant, not a decision maker.
            </p>
            <div className="flex justify-center gap-4">
                <Button variant="primary" onClick={() => navigate('/ai-health')} icon={<Brain size={18} />}>
                    Try AI Models
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="border-teal/20">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Brain size={20} className="text-teal"/> What AI Does
                </h3>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-text-secondary">
                        <FileText size={18} className="text-teal mt-1" />
                        Summarizes complex medical documents and discharge summaries.
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                        <Activity size={18} className="text-teal mt-1" />
                        Highlights lab trends and abnormal values.
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                        <Database size={18} className="text-teal mt-1" />
                        Organizes unstructured patient history into timeline views.
                    </li>
                </ul>
            </GlassCard>

            <GlassCard className="border-red-500/20 bg-red-500/5">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle size={20} className="text-red-400"/> What AI Never Does
                </h3>
                <ul className="space-y-4">
                    <li className="flex items-start gap-3 text-text-secondary">
                        <XCircle size={18} className="text-red-400 mt-1" />
                        Diagnose patients autonomously.
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                        <XCircle size={18} className="text-red-400 mt-1" />
                        Prescribe medication without doctor review.
                    </li>
                    <li className="flex items-start gap-3 text-text-secondary">
                        <XCircle size={18} className="text-red-400 mt-1" />
                        Override clinical decisions.
                    </li>
                </ul>
            </GlassCard>
        </div>

        <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <ShieldCheck size={32} className="text-purple" />
                <div>
                    <h3 className="text-lg font-bold text-white">Safety Statement</h3>
                    <p className="text-sm text-text-secondary">All AI outputs are clearly labeled as non-authoritative and are fully auditable.</p>
                </div>
            </div>
            <Button variant="outline">View Safety Whitepaper</Button>
        </div>
    </div>
  );
};

// Import helper icons not in standard list
import { Activity, Database, XCircle } from 'lucide-react';
