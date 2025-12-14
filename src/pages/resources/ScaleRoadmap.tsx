
import React from 'react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { 
  Milestone, ArrowRight, ShieldCheck, Users, 
  TrendingUp, AlertTriangle, CheckCircle, Lock, 
  Building2, Database, Brain, Globe, ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ScaleRoadmap: React.FC = () => {
  const navigate = useNavigate();

  const phases = [
    {
      id: 0,
      title: "Pilot Close-out",
      time: "Weeks 0–2",
      icon: <CheckCircle className="text-teal" size={24} />,
      objective: "Decide GO / NO-GO & Convert Pilot",
      columns: [
        { title: "Actions", items: ["Freeze pilot data (read-only backup)", "Document friction points", "Fix only blockers & bugs"] },
        { title: "Output", items: ["Pilot Report", "Written Testimonial", "Paid Contract (Discounted)"] }
      ]
    },
    {
      id: 1,
      title: "Multi-Hospital Expansion",
      time: "Months 1–3",
      icon: <Building2 className="text-purple" size={24} />,
      objective: "Scale to 5-10 Hospitals (50-100 Doctors)",
      columns: [
        { title: "Product", items: ["Tenant hardening", "Availability scheduling polish", "Load handling"] },
        { title: "Ops", items: ["Hospital onboarding SOP", "Support escalation matrix"] },
        { title: "Revenue", items: ["Convert pilots to paid plans", "Bundle onboarding support"] }
      ]
    },
    {
      id: 2,
      title: "Labs & Pharmacy Integration",
      time: "Months 3–6",
      icon: <Database className="text-blue-400" size={24} />,
      objective: "Increase Utility & Stickiness",
      columns: [
        { title: "Product", items: ["Lab report ingestion (PDF/Structured)", "e-Prescription routing", "Status tracking"] },
        { title: "Guardrails", items: ["Vendors never see full history", "Consent scopes enforced"] },
        { title: "Revenue", items: ["Hospital plan upsell", "Optional SaaS fees for labs"] }
      ]
    },
    {
      id: 3,
      title: "ABDM Sandbox -> Limited Live",
      time: "Months 6–9",
      icon: <Globe className="text-orange-500" size={24} />,
      objective: "National Interoperability",
      columns: [
        { title: "Scope", items: ["HIU Role First", "Sandbox Certification", "Select Live Exchanges"] },
        { title: "Product", items: ["Harden ABDM adapter", "Consent artefact compliance"] },
        { title: "Ops", items: ["Compliance audits", "Legal sign-off", "Incident drills"] }
      ]
    },
    {
      id: 4,
      title: "Advanced AI",
      time: "Months 9–12",
      icon: <Brain className="text-pink-500" size={24} />,
      objective: "Scale Stability Before Intelligence",
      columns: [
        { title: "Enable", items: ["Document summarization", "Risk flagging", "Preventive care reminders"] },
        { title: "Must-Haves", items: ["Explainability", "Opt-in only", "Doctor-controlled outputs"] },
        { title: "Monetization", items: ["Doctor premium tier", "Analytics add-ons"] }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-16">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
            <div>
                <Button variant="outline" onClick={() => navigate(-1)} className="mb-4 text-xs !py-1 !px-3" icon={<ArrowLeft size={12}/>}>Back</Button>
                <h1 className="text-4xl font-display font-bold text-white mb-2">
                    Post-Pilot Scale Roadmap
                </h1>
                <p className="text-text-secondary text-lg">
                    Product · Ops · Revenue · Compliance
                </p>
            </div>
            <div className="flex items-center gap-3">
                <Badge color="teal">Status: Phase 0</Badge>
                <div className="text-right">
                    <p className="text-xs text-text-secondary uppercase tracking-wider">Current Goal</p>
                    <p className="text-white font-bold">Safe Stabilization</p>
                </div>
            </div>
        </div>

        {/* Timeline Phases */}
        <div className="space-y-8 relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10 hidden md:block" />
            
            {phases.map((phase) => (
                <div key={phase.id} className="relative md:pl-24">
                    {/* Timeline Node */}
                    <div className="hidden md:flex absolute left-0 top-0 w-16 h-16 bg-[#0D0F12] border-2 border-white/10 rounded-full items-center justify-center z-10">
                        {phase.icon}
                    </div>

                    <GlassCard className="relative overflow-hidden group hover:border-white/20 transition-all">
                        <div className="absolute top-0 right-0 p-4 opacity-10 font-display font-bold text-6xl text-white">
                            {phase.id}
                        </div>
                        
                        <div className="flex flex-col gap-6 relative z-10">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-white/5 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{phase.title}</h3>
                                    <p className="text-sm text-teal">{phase.time} • {phase.objective}</p>
                                </div>
                                {phase.id === 4 && <Badge color="purple">High Risk</Badge>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {phase.columns.map((col, i) => (
                                    <div key={i}>
                                        <h4 className="text-xs text-text-secondary uppercase tracking-wider font-bold mb-2">{col.title}</h4>
                                        <ul className="space-y-1">
                                            {col.items.map((item, idx) => (
                                                <li key={idx} className="text-sm text-white flex items-start gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-white/50 mt-2 flex-shrink-0" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </GlassCard>
                </div>
            ))}
        </div>

        {/* Metrics & Org */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard>
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <TrendingUp size={20} className="text-green-400" /> Key Metrics (Non-Negotiable)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-text-secondary uppercase">Trust</p>
                        <p className="text-white font-bold">Consent Denial Rate</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-text-secondary uppercase">Adoption</p>
                        <p className="text-white font-bold">Weekly Active Doctors</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-text-secondary uppercase">Ops</p>
                        <p className="text-white font-bold">Support Tickets / Hospital</p>
                    </div>
                    <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-xs text-text-secondary uppercase">Revenue</p>
                        <p className="text-white font-bold">Conversion Rate</p>
                    </div>
                </div>
            </GlassCard>

            <GlassCard>
                <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                    <Users size={20} className="text-blue-400" /> Org Scaling
                </h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                        <span className="text-green-400 font-bold text-sm">HIRE NOW</span>
                        <div className="text-right text-xs text-text-secondary">
                            <div>Support / Ops Lead</div>
                            <div>Backend Engineer</div>
                            <div>Clinical Product Advisor</div>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-red-400 font-bold text-sm">WAIT</span>
                        <div className="text-right text-xs text-text-secondary">
                            <div>Growth Hackers</div>
                            <div>Consumer Marketing</div>
                            <div>Data Scientists</div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>

        {/* Risk Matrix */}
        <GlassCard className="border-red-500/20 bg-red-500/5">
            <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                <AlertTriangle size={20} className="text-red-400" /> Risk Mitigation
            </h3>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-black/20 text-text-secondary text-xs uppercase">
                        <tr>
                            <th className="p-3">Risk</th>
                            <th className="p-3">Mitigation Strategy</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-red-500/10">
                        <tr>
                            <td className="p-3 text-white font-bold">Feature Creep</td>
                            <td className="p-3 text-text-secondary">Strict roadmap gates. No new features in Phase 1.</td>
                        </tr>
                        <tr>
                            <td className="p-3 text-white font-bold">Doctor Fatigue</td>
                            <td className="p-3 text-text-secondary">Prioritize UX speed over new capabilities.</td>
                        </tr>
                        <tr>
                            <td className="p-3 text-white font-bold">Compliance Drift</td>
                            <td className="p-3 text-text-secondary">Regular automated audits of access logs.</td>
                        </tr>
                        <tr>
                            <td className="p-3 text-white font-bold">Scaling Too Fast</td>
                            <td className="p-3 text-text-secondary">Hard caps on number of hospitals per phase.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </GlassCard>

        {/* Footer */}
        <div className="text-center pt-8 border-t border-white/10">
            <p className="text-lg font-bold text-white mb-2">Wysh Care Scale Philosophy</p>
            <p className="text-text-secondary">Scale deliberately. Preserve trust. Automate safety.</p>
        </div>
    </div>
  );
};
