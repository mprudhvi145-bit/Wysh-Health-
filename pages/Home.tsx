import React from 'react';
import { ArrowRight, Activity, Shield, Cpu, Globe } from 'lucide-react';
import { Button, GlassCard } from '../components/UI';
import { DNAHelix } from '../components/3DVisuals';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="space-y-32 pb-20">
      
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-teal/5 to-transparent pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-teal text-xs font-mono tracking-wider">
              <span className="w-2 h-2 rounded-full bg-teal animate-pulse" />
              SYSTEM OPERATIONAL v4.0
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-text-secondary">
              Building the <br/>
              <span className="text-teal-glow text-glow">OS of Healthcare</span>
            </h1>
            
            <p className="text-lg text-text-secondary max-w-lg leading-relaxed">
              A unified ecosystem integrating Telemedicine, EHR, and AI Logistics. 
              Experience the future of medical infrastructure today.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/ai-health">
                <Button variant="primary" icon={<ArrowRight size={18} />}>Explore AI Platform</Button>
              </Link>
              <Link to="/investors">
                <Button variant="outline">Investor Deck</Button>
              </Link>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <h4 className="text-2xl font-bold text-white">99.9%</h4>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Uptime</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white">50+</h4>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Hospitals</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold text-white">AI-1st</h4>
                <p className="text-xs text-text-secondary uppercase tracking-wider">Architecture</p>
              </div>
            </div>
          </div>

          <div className="relative h-[500px] hidden lg:block">
             <div className="absolute inset-0 bg-gradient-radial from-teal/20 to-transparent opacity-50 blur-3xl" />
             <div className="relative w-full h-full glass-panel rounded-full overflow-hidden border-0">
               <DNAHelix />
               
               {/* Floating Holographic Cards */}
               <GlassCard className="absolute top-10 right-0 w-48 !p-4 animate-float" hoverEffect={false}>
                  <div className="flex items-center gap-3 mb-2">
                    <Activity size={16} className="text-teal" />
                    <span className="text-xs font-bold text-white">Vitals Live</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-teal w-[70%]" />
                  </div>
               </GlassCard>

               <GlassCard className="absolute bottom-20 left-10 w-48 !p-4 animate-float" style={{ animationDelay: '2s' }} hoverEffect={false}>
                  <div className="flex items-center gap-3 mb-2">
                    <Cpu size={16} className="text-purple" />
                    <span className="text-xs font-bold text-white">AI Analysis</span>
                  </div>
                  <div className="text-xs text-text-secondary">Processing genome sequence...</div>
               </GlassCard>
             </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Core Architecture</h2>
          <p className="text-text-secondary">Powered by Wysh Intelligence Engine</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="h-full">
            <div className="w-12 h-12 bg-teal/10 rounded-lg flex items-center justify-center mb-6 text-teal">
              <Globe size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Telemedicine 2.0</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Global connectivity with local precision. HD video consults integrated directly into the EHR workflow.
            </p>
          </GlassCard>

          <GlassCard className="h-full">
            <div className="w-12 h-12 bg-purple/10 rounded-lg flex items-center justify-center mb-6 text-purple">
              <Shield size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Secure EHR</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Patient data secured by advanced encryption. Interoperable with FHIR and HL7 standards.
            </p>
          </GlassCard>

          <GlassCard className="h-full">
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-6 text-blue-400">
              <Cpu size={24} />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Diagnostics</h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Predictive risk modeling and automated medical coding to reduce administrative overhead by 40%.
            </p>
          </GlassCard>
        </div>
      </section>
    </div>
  );
};