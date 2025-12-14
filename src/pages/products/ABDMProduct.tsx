
import React from 'react';
import { GlassCard, Button, Badge } from '../../components/UI';
import { ShieldCheck, Lock, RefreshCw, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const ABDMProduct: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-16">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
            <Button variant="outline" onClick={() => navigate('/products')} className="mb-4 text-xs !py-1 !px-3">Back to Platform</Button>
            <div className="flex justify-center mb-4">
                <img src="https://abdm.gov.in/assets/images/logo/ndhm-logo.svg" alt="ABDM" className="h-12" style={{filter: 'invert(1)'}}/>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold text-white">
                Seamless <span className="text-orange-500">ABDM</span> Integration
            </h1>
            <p className="text-text-secondary text-lg">
                Wysh Care acts as both a Health Information Provider (HIP) and Health Information User (HIU). 
                Fully certified for the National Digital Health Ecosystem.
            </p>
            <div className="flex justify-center gap-4">
                <Button variant="primary" onClick={() => navigate('/abha')} icon={<ShieldCheck size={18} />}>
                    Manage ABHA ID
                </Button>
            </div>
        </div>

        {/* Visual Flow */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-teal/20 via-purple/20 to-teal/20 -translate-y-1/2 hidden md:block" />
            
            <GlassCard className="text-center relative z-10 bg-[#0D0F12]">
                <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 text-teal">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-white font-bold mb-2">1. Identity (ABHA)</h3>
                <p className="text-sm text-text-secondary">
                    Patients link their Ayushman Bharat Health Account (ABHA). Wysh verifies identity securely.
                </p>
            </GlassCard>

            <GlassCard className="text-center relative z-10 bg-[#0D0F12]">
                <div className="w-16 h-16 bg-purple/10 rounded-full flex items-center justify-center mx-auto mb-4 text-purple">
                    <Lock size={32} />
                </div>
                <h3 className="text-white font-bold mb-2">2. Consent Ledger</h3>
                <p className="text-sm text-text-secondary">
                    Data is requested. Patient receives a consent prompt. Access is granted only for specific artifacts and duration.
                </p>
            </GlassCard>

            <GlassCard className="text-center relative z-10 bg-[#0D0F12]">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                    <RefreshCw size={32} />
                </div>
                <h3 className="text-white font-bold mb-2">3. Data Exchange</h3>
                <p className="text-sm text-text-secondary">
                    Encrypted health records flow from HIPs to Wysh (HIU). Doctors view a unified history.
                </p>
            </GlassCard>
        </div>

        {/* Technical Capabilities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
                <h2 className="text-3xl font-display font-bold text-white">Compliance Built-In</h2>
                <div className="space-y-4">
                    <div className="flex gap-4">
                        <div className="mt-1"><FileText className="text-teal" size={20} /></div>
                        <div>
                            <h4 className="text-white font-bold">Standardized Artifacts</h4>
                            <p className="text-sm text-text-secondary">Supports FHIR bundles for Prescriptions, Diagnostic Reports, and Discharge Summaries.</p>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <div className="mt-1"><Lock className="text-purple" size={20} /></div>
                        <div>
                            <h4 className="text-white font-bold">Privacy by Design</h4>
                            <p className="text-sm text-text-secondary">Data is ephemeral or stored securely based on consent. Logs are immutable.</p>
                        </div>
                    </div>
                </div>
                <Button variant="outline" className="mt-4" icon={<ExternalLink size={16} />}>
                    View Technical Architecture
                </Button>
            </div>

            <div className="bg-white/5 rounded-2xl p-6 border border-white/10 font-mono text-xs overflow-hidden relative">
                <div className="absolute top-0 right-0 p-2 bg-black/50 text-teal rounded-bl-lg">LIVE LOG STREAM</div>
                <div className="space-y-2 opacity-80">
                    <p className="text-teal">POST /gateway/v0.5/consent-requests</p>
                    <p className="text-white">{`{ "purpose": { "code": "CAREMGT" }, "scope": ["Prescription"] }`}</p>
                    <p className="text-green-400">202 ACCEPTED - REQUEST_ID: 8a7b3c...</p>
                    <div className="h-px bg-white/10 my-2"/>
                    <p className="text-purple">CALLBACK /gateway/v0.5/consents/on-notify</p>
                    <p className="text-white">{`{ "status": "GRANTED", "artifacts": ["OP-Consult-001"] }`}</p>
                </div>
            </div>
        </div>
    </div>
  );
};
