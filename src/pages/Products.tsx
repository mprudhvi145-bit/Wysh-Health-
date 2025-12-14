
import React, { useState } from 'react';
import { GlassCard, Button, Badge } from '../components/UI';
import { Database, Activity, ShieldCheck, Cpu, ArrowRight, Layers, Users, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Products: React.FC = () => {
  const navigate = useNavigate();
  const [audience, setAudience] = useState<'clinics' | 'patients' | 'enterprise'>('clinics');

  const content = {
    clinics: {
      title: "For Clinics & Doctors",
      desc: "A unified workspace to manage appointments, clinical notes, and prescriptions without the paperwork.",
      features: ["Smart EMR", "Telemedicine", "AI Scribe"]
    },
    patients: {
      title: "For Patients",
      desc: "One app for your entire family's health. Secure records, instant access to doctors, and personalized AI insights.",
      features: ["Health Locker", "Video Consults", "Family ABHA"]
    },
    enterprise: {
      title: "For Hospitals & Government",
      desc: "ABDM-compliant infrastructure that scales. Interoperability, population analytics, and audit-ready security.",
      features: ["ABDM Gateway", "Analytics", "Multi-Tenant"]
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <Badge color="teal">Platform Overview</Badge>
        <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
          The <span className="text-teal-glow text-glow">Operating System</span> <br/>for Healthcare
        </h1>
        <p className="text-text-secondary text-lg">
          Wysh Care unifies the fragmented medical ecosystem into a single, intelligent layer. 
          Connect EMR, Telemedicine, and AI in one seamless flow.
        </p>
        <div className="flex justify-center gap-4">
            <Button variant="primary" onClick={() => navigate('/products/how-it-works')} icon={<ArrowRight size={18}/>}>
                See How It Works
            </Button>
            <Button variant="outline" onClick={() => navigate('/contact')}>
                Book Demo
            </Button>
        </div>
      </div>

      {/* Audience Switcher */}
      <div className="flex flex-col items-center gap-8">
          <div className="bg-white/5 p-1 rounded-xl border border-white/10 flex flex-wrap justify-center gap-1">
              <button 
                onClick={() => setAudience('clinics')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${audience === 'clinics' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
              >
                  <Users size={16}/> Clinics
              </button>
              <button 
                onClick={() => setAudience('patients')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${audience === 'patients' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
              >
                  <Activity size={16}/> Patients
              </button>
              <button 
                onClick={() => setAudience('enterprise')}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${audience === 'enterprise' ? 'bg-teal text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
              >
                  <Building2 size={16}/> Enterprise
              </button>
          </div>

          <GlassCard className="max-w-4xl w-full text-center bg-gradient-to-b from-teal/5 to-transparent border-teal/20">
              <h2 className="text-2xl font-bold text-white mb-2">{content[audience].title}</h2>
              <p className="text-text-secondary max-w-xl mx-auto mb-6">{content[audience].desc}</p>
              <div className="flex flex-wrap justify-center gap-3">
                  {content[audience].features.map(f => (
                      <Badge key={f} color="purple">{f}</Badge>
                  ))}
              </div>
          </GlassCard>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlassCard className="group hover:border-teal/50 cursor-pointer h-full flex flex-col" onClick={() => navigate('/products/emr')}>
              <div className="p-3 bg-teal/10 rounded-lg text-teal w-fit mb-4 group-hover:bg-teal group-hover:text-white transition-colors">
                  <Database size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Wysh EMR</h3>
              <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Next-gen Electronic Medical Records. Longitudinal patient timeline, smart prescribing, and standardized clinical catalogs.
              </p>
              <div className="flex items-center text-teal text-sm font-bold mt-auto">
                  Explore EMR <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
          </GlassCard>

          <GlassCard className="group hover:border-purple/50 cursor-pointer h-full flex flex-col" onClick={() => navigate('/products/abdm')}>
              <div className="p-3 bg-purple/10 rounded-lg text-purple w-fit mb-4 group-hover:bg-purple group-hover:text-white transition-colors">
                  <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">ABDM Gateway</h3>
              <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Full compliance with India's Digital Health Mission. ABHA creation, consent management, and interoperable data exchange.
              </p>
              <div className="flex items-center text-purple text-sm font-bold mt-auto">
                  View Compliance <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
          </GlassCard>

          <GlassCard className="group hover:border-blue-400/50 cursor-pointer h-full flex flex-col" onClick={() => navigate('/ai-health')}>
              <div className="p-3 bg-blue-500/10 rounded-lg text-blue-400 w-fit mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                  <Cpu size={24} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Clinical AI</h3>
              <p className="text-sm text-text-secondary mb-4 flex-grow">
                  Powered by Gemini 2.5. Automated medical coding, predictive risk analysis, and document summarization.
              </p>
              <div className="flex items-center text-blue-400 text-sm font-bold mt-auto">
                  Try AI Models <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
          </GlassCard>
      </div>

      {/* Ecosystem Visual */}
      <div className="relative rounded-2xl border border-white/10 bg-black/40 overflow-hidden min-h-[300px] flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2070&auto=format&fit=crop')] opacity-10 bg-cover bg-center" />
          <div className="relative z-10 text-center space-y-4 p-6">
              <Layers size={48} className="mx-auto text-teal" />
              <h2 className="text-3xl font-display font-bold text-white">One Unified Architecture</h2>
              <p className="text-text-secondary max-w-xl mx-auto">
                  Stop using 10 different tools. Wysh Care brings Scheduling, Billing, Clinical Notes, and Lab Integrations into one fluid interface.
              </p>
          </div>
      </div>

    </div>
  );
};
