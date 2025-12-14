
import React, { useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { Database, Activity, ShieldCheck, Cpu, ArrowRight, Layers, Users, Building2, Fingerprint, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [audience, setAudience] = useState<'clinics' | 'hospitals' | 'patients' | 'government'>('clinics');

  const content = {
    clinics: {
      label: "Clinics & Doctors",
      title: "Spend less time on documentation. Spend more time on patient care.",
      desc: "Wysh Care streamlines consultations, prescriptions, lab workflows, and follow-ups — without compromising clinical control or safety.",
      features: ["Smart EMR", "Telemedicine", "AI Scribe"]
    },
    hospitals: {
      label: "Hospitals",
      title: "A single system for clinical operations, compliance, and scale.",
      desc: "Wysh Care supports multi-doctor workflows, longitudinal patient records, audit logs, and ABDM readiness — built for institutional healthcare.",
      features: ["Multi-Tenant", "Audit Logs", "Analytics"]
    },
    patients: {
      label: "Patients & Families",
      title: "Your health records. Your control. For life.",
      desc: "Wysh Care gives patients secure access to prescriptions, lab reports, AI summaries, and consent management — all in one place.",
      features: ["Health Locker", "Video Consults", "Family ABHA"]
    },
    government: {
      label: "Government / ABDM",
      title: "Consent-first. Interoperable. Auditable.",
      desc: "Wysh Care is architected to function as both HIP and HIU, aligned with India’s National Digital Health Mission.",
      features: ["HIP/HIU Ready", "Consent Ledger", "Interoperability"]
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <Badge color="teal">Platform Overview</Badge>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
          Wysh Care<br/>
          <span className="text-teal-glow text-glow">The Digital Health Operating System</span>
        </h1>
        <p className="text-text-secondary text-lg max-w-3xl mx-auto">
          A unified EMR, AI, and ABDM-ready platform that connects patients, doctors, labs, and healthcare systems — securely, transparently, and with patient consent at the core.
        </p>
        <div className="flex justify-center gap-4">
            <Button variant="primary" onClick={() => navigate('/products/how-it-works')} icon={<ArrowRight size={18}/>}>
                How It Works
            </Button>
            <Button variant="outline" onClick={() => navigate('/contact')}>
                Book Demo
            </Button>
        </div>
      </div>

      {/* Audience Switcher */}
      <div className="flex flex-col items-center gap-8">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex flex-wrap justify-center gap-1">
              {(Object.keys(content) as Array<keyof typeof content>).map((key) => (
                  <button 
                    key={key}
                    onClick={() => setAudience(key)}
                    className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${audience === key ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                  >
                      {key === 'clinics' && <Users size={16}/>}
                      {key === 'hospitals' && <Building2 size={16}/>}
                      {key === 'patients' && <Activity size={16}/>}
                      {key === 'government' && <Globe size={16}/>}
                      {content[key].label}
                  </button>
              ))}
          </div>

          <GlassCard className="max-w-4xl w-full text-center bg-gradient-to-b from-teal/5 to-transparent border-teal/20">
              <h2 className="text-2xl font-bold text-white mb-2">{content[audience].title}</h2>
              <p className="text-text-secondary max-w-2xl mx-auto mb-6">{content[audience].desc}</p>
              <div className="flex flex-wrap justify-center gap-3">
                  {content[audience].features.map(f => (
                      <Badge key={f} color="purple">{f}</Badge>
                  ))}
              </div>
          </GlassCard>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlassCard className="group hover:border-teal/50 cursor-pointer h-full flex flex-col" onClick={() => navigate('/products/wysh-id')}>
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 w-fit mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Fingerprint size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Wysh ID</h3>
              <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Unified digital health identity linked with ABHA. Lifetime continuity.
              </p>
              <div className="flex items-center text-blue-400 text-xs font-bold mt-auto">
                  Learn More <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
          </GlassCard>

          <GlassCard className="group hover:border-teal/50 cursor-pointer h-full flex flex-col" onClick={() => navigate('/products/emr')}>
              <div className="p-3 bg-teal/10 rounded-lg text-teal w-fit mb-4 group-hover:bg-teal group-hover:text-white transition-colors">
                  <Database size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Wysh EMR</h3>
              <p className="text-sm text-text-secondary mb-4 flex-grow">
                  End-to-end electronic medical records. Built for Doctors.
              </p>
              <div className="flex items-center text-teal text-xs font-bold mt-auto">
                  Explore EMR <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
          </GlassCard>

          <GlassCard className="group hover:border-purple/50 cursor-pointer h-full flex flex-col" onClick={() => navigate('/products/ai-clinical')}>
              <div className="p-3 bg-purple/10 rounded-lg text-purple w-fit mb-4 group-hover:bg-purple group-hover:text-white transition-colors">
                  <Cpu size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">AI Clinical</h3>
              <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Reduce cognitive load. Summaries, trends, and insights.
              </p>
              <div className="flex items-center text-purple text-xs font-bold mt-auto">
                  View Insights <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
          </GlassCard>

          <GlassCard className="group hover:border-orange-500/50 cursor-pointer h-full flex flex-col" onClick={() => navigate('/products/abdm')}>
              <div className="p-3 bg-orange-500/10 rounded-lg text-orange-500 w-fit mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">ABDM Ready</h3>
              <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Consent-driven health data exchange. National interoperability.
              </p>
              <div className="flex items-center text-orange-500 text-xs font-bold mt-auto">
                  Check Compliance <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
          </GlassCard>
      </div>

      {/* Trust Footer */}
      <div className="text-center border-t border-white/10 pt-12">
          <p className="text-lg font-bold text-white mb-2">Wysh Care is built for real healthcare — not demos.</p>
          <p className="text-text-secondary">Every action is logged. Every record is consent-controlled. Every system is designed for scale, safety, and trust.</p>
      </div>

    </div>
  );
};
